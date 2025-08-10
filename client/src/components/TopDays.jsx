import React, { useEffect, useState } from 'react';

/**
 * Display top N days with highest usage
 */
export default function TopDays({ fetchTopDays }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTopDays(3);
        setData(res);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchTopDays]);

  return (
    <div className="card">
      <h3>วันที่ใช้เยอะสุด (Top 3)</h3>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ol>
          {data.map((item) => (
            <li key={item.date}>
              <b>{item.date}</b> — {item.totalKwh.toFixed(2)} kWh ({item.totalCost.toFixed(2)} บาท)
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
