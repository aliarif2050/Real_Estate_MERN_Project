import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import uploadRoutes from "./routes/upload.route.js";
import listingRoutes from "./routes/listing.route.js";

dotenv.config()
const app = express()

// Debugging: Log the FRONTEND_URL value
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(express.json())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=> console.log(err))

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use("/api", uploadRoutes);
app.use("/api/listing", listingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is working!', frontendUrl: process.env.FRONTEND_URL });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })  
})

// Export for Vercel (if using serverless functions)
export default app;

// Only start server if not in production (for Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000,()=> {
    console.log('Server running on port 3000')
  })
}