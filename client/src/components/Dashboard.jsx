import React, { useEffect, useState } from 'react';

/**
 * Dashboard summary for this month and last month
 */
export default function Dashboard({ fetchSummary }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const sum = await fetchSummary();
        setData(sum);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [fetchSummary]);

  if (error) {
    return (
      <div className="card">
        <p className="error">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="card">
        <p>กำลังโหลดแดชบอร์ด...</p>
      </div>
    );
  }
  const { thisMonth, lastMonth } = data;
  return (
    <div className="card">
      <h3>แดชบอร์ดสรุป</h3>
      <div className="grid-cols-2">
        <div className="stat">
          <div className="label">เดือนนี้ (kWh)</div>
          <div className="value">{(thisMonth.kwh || 0).toFixed(2)}</div>
          <div className="sub">{(thisMonth.cost || 0).toFixed(2)} บาท</div>
        </div>
        <div className="stat">
          <div className="label">เดือนที่แล้ว (kWh)</div>
          <div className="value">{(lastMonth.kwh || 0).toFixed(2)}</div>
          <div className="sub">{(lastMonth.cost || 0).toFixed(2)} บาท</div>
        </div>
      </div>
    </div>
  );
}
