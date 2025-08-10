import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import entriesRouter from './src/routes/entries.js';
import statsRouter from './src/routes/stats.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
// Support comma-separated list for multiple origins or default to '*'
const origins = process.env.CORS_ORIGIN?.split(',') || ['*'];
app.use(cors({ origin: origins }));

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api/entries', entriesRouter);
app.use('/api/stats', statsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
