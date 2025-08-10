import { Router } from 'express';
import Entry from '../models/Entry.js';

const router = Router();

// GET /api/stats/top-days?limit=3
router.get('/top-days', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(20, Number(req.query.limit) || 3));
    const result = await Entry.aggregate([
      { $group: { _id: '$dateStr', totalKwh: { $sum: '$kwh' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } },
      { $sort: { totalKwh: -1 } },
      { $limit: limit },
    ]);
    res.json(result.map((d) => ({ date: d._id, totalKwh: d.totalKwh, totalCost: d.totalCost, count: d.count })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/summary
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const [thisMonthAgg, lastMonthAgg] = await Promise.all([
      Entry.aggregate([
        { $match: { recordedAt: { $gte: startThisMonth, $lt: startNextMonth } } },
        { $group: { _id: null, kwh: { $sum: '$kwh' }, cost: { $sum: '$cost' } } },
      ]),
      Entry.aggregate([
        { $match: { recordedAt: { $gte: startLastMonth, $lt: startThisMonth } } },
        { $group: { _id: null, kwh: { $sum: '$kwh' }, cost: { $sum: '$cost' } } },
      ]),
    ]);
    const thisMonth = thisMonthAgg[0] || { kwh: 0, cost: 0 };
    const lastMonth = lastMonthAgg[0] || { kwh: 0, cost: 0 };
    res.json({ thisMonth, lastMonth });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
