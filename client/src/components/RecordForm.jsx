import React, { useState } from 'react';
import dayjs from 'dayjs';

/**
 * Form to record a new electricity entry
 * @param {function} onCreated Callback invoked after successful creation
 */
export default function RecordForm({ onCreated }) {
  const [kwh, setKwh] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(kwh);
    if (Number.isNaN(value) || value < 0) {
      alert('กรอกหน่วยเป็นตัวเลขที่ไม่ติดลบ');
      return;
    }
    const recordedAt = dayjs(`${date} ${time}`).toDate();
    setLoading(true);
    try {
      await onCreated(value, recordedAt);
      setKwh('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>บันทึกค่าไฟ</h3>
      <div className="grid">
        <label>
          หน่วย (kWh)
          <input
            type="number"
            step="0.01"
            min="0"
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
            required
          />
        </label>
        <label>
          วันที่
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          เวลา
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
      </div>
      <button disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
    </form>
  );
}
