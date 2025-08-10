import React, { useCallback, useEffect, useState } from 'react';
import { createEntry, listEntries, getTopDays, getSummary } from './api.js';
import RecordForm from './components/RecordForm.jsx';
import Filters from './components/Filters.jsx';
import EntryTable from './components/EntryTable.jsx';
import TopDays from './components/TopDays.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [date, setDate] = useState('');
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadEntries = useCallback(
    async (p = 1, d = date) => {
      setLoading(true);
      try {
        const res = await listEntries({ date: d || undefined, page: p, limit: 50 });
        setEntries(res.items);
        setPage(res.page);
        setPages(res.pages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [date]
  );

  // Load entries on mount and whenever date changes via filters
  useEffect(() => {
    loadEntries(1);
  }, [loadEntries]);

  async function handleCreated(kwh, recordedAt) {
    await createEntry(kwh, recordedAt);
    // After creation, reload current page with same date filter
    await loadEntries(page, date);
  }

  return (
    <div className="container">
      <header>
        <h1>Electricity Usage Logger</h1>
        <p>คิดค่าไฟหน่วยละ 8 บาท • ค้นหาได้ตามวันที่ • 50 รายการต่อหน้า</p>
      </header>

      <Dashboard fetchSummary={getSummary} />

      <div className="layout">
        <div className="left">
          <RecordForm onCreated={handleCreated} />
          <TopDays fetchTopDays={getTopDays} />
        </div>
        <div className="right">
          <Filters
            date={date}
            setDate={setDate}
            onSearch={() => loadEntries(1, date)}
            onClear={() => {
              setDate('');
              loadEntries(1, '');
            }}
          />
          {loading ? (
            <div className="card">
              <p>กำลังโหลด...</p>
            </div>
          ) : (
            <EntryTable data={entries} page={page} pages={pages} onPage={(p) => loadEntries(p, date)} />
          )}
        </div>
      </div>

      <footer>
        <small>© {new Date().getFullYear()} Electricity Usage Logger</small>
      </footer>
    </div>
  );
}
