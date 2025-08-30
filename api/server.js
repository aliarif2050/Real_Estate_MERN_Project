import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import uploadRoutes from './routes/upload.route.js';
import listingRoutes from './routes/listing.route.js';
import { connectToDatabase } from './db.js';
await connectToDatabase(process.env.MONGO);

dotenv.config();
const app = express();

// Log FRONTEND_URL for debugging
console.log('FRONTEND_URL:', process.env.FRONTEND_URL?.replace(/\/$/, ''));

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL?.replace(/\/$/, '')
    : 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api', uploadRoutes);
app.use('/api/listing', listingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is working!', frontendUrl: process.env.FRONTEND_URL });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

// Export for Vercel
export default app;

// Start server locally if not in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Server running on port 3000'));
}
