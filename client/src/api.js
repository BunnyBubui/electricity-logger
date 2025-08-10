// Client-side API helpers for the electricity logger

const BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '';

/**
 * Create a new entry
 * @param {number} kwh Number of units
 * @param {Date} recordedAt Timestamp
 */
export async function createEntry(kwh, recordedAt) {
  const res = await fetch(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kwh, recordedAt }),
  });
  if (!res.ok) throw new Error('Failed to create entry');
  return res.json();
}

/**
 * List entries with optional date filter and pagination
 * @param {Object} options
 */
export async function listEntries({ date, page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  params.set('page', page);
  params.set('limit', limit);
  const res = await fetch(`${BASE}/entries?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

/**
 * Fetch top N days with highest usage
 * @param {number} limit
 */
export async function getTopDays(limit = 3) {
  const res = await fetch(`${BASE}/stats/top-days?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch top days');
  return res.json();
}

/**
 * Fetch summary for this month and last month
 */
export async function getSummary() {
  const res = await fetch(`${BASE}/stats/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}
