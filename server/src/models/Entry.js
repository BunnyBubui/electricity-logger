import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema(
  {
    // kWh consumed (units)
    kwh: { type: Number, required: true, min: 0 },
    // Calculated cost (THB)
    cost: { type: Number, required: true, min: 0 },
    // Timestamp when the reading was recorded
    recordedAt: { type: Date, required: true },
    // Local date string (YYYY-MM-DD) for quick filtering
    dateStr: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Entry', EntrySchema);
