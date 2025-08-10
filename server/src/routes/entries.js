import { Router } from 'express';
import Entry from '../models/Entry.js';

const router = Router();

// Unit price per kWh from environment (defaults to 8 THB)
const UNIT_PRICE = Number(process.env.UNIT_PRICE_THB || 8);

// Helper to format a date into YYYY-MM-DD (local timezone)
function toDateStr(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Create a new entry
router.post('/', async (req, res) => {
  try {
    const { kwh, recordedAt } = req.body;
    const units = Number(kwh);
    if (Number.isNaN(units) || units < 0) {
      return res.status(400).json({ error: 'kwh must be a non-negative number' });
    }
    // Use provided timestamp or current date/time
    const when = recordedAt ? new Date(recordedAt) : new Date();
    const dateStr = toDateStr(when);
    const cost = Math.round(units * UNIT_PRICE * 100) / 100;
    const doc = await Entry.create({ kwh: units, cost, recordedAt: when, dateStr });
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// List entries with optional date filter and pagination
// GET /api/entries?date=YYYY-MM-DD&page=1&limit=50
router.get('/', async (req, res) => {
  try {
    const { date, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (date) filter.dateStr = String(date);
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(200, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const [items, total] = await Promise.all([
      Entry.find(filter)
        .sort({ recordedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Entry.countDocuments(filter),
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
