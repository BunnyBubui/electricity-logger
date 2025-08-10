import React from 'react';

/**
 * Table to display entries with pagination controls
 */
export default function EntryTable({ data, page, pages, onPage }) {
  return (
    <div className="card">
      <h3>รายการบันทึก</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>วันที่-เวลา</th>
              <th>หน่วย (kWh)</th>
              <th>ค่าไฟ (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row._id}>
                <td>{new Date(row.recordedAt).toLocaleString()}</td>
                <td>{row.kwh.toFixed(2)}</td>
                <td>{row.cost.toFixed(2)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ก่อนหน้า
        </button>
        <span>
          หน้า {page} / {pages || 1}
        </span>
        <button disabled={pages === 0 || page >= pages} onClick={() => onPage(page + 1)}>
          ถัดไป
        </button>
      </div>
      <small>แสดง 50 รายการต่อหน้า</small>
    </div>
  );
}
