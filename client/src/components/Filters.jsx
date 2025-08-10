import React from 'react';

/**
 * Filters for searching entries by date
 */
export default function Filters({ date, setDate, onSearch, onClear }) {
  return (
    <div className="card">
      <h3>ค้นหาตามวันที่</h3>
      <div className="grid">
        <label>
          วันที่
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <button onClick={onSearch}>ค้นหา</button>
        <button className="secondary" onClick={onClear}>ล้าง</button>
      </div>
    </div>
  );
}
