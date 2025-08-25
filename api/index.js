import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import uploadRoutes from "./routes/upload.route.js";
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Cnnected to MongoDB")
}).catch((err)=> console.log(err))
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use("/api", uploadRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    return res.status(statusCode).json({
        success: false,
        statusCode ,
        message
    })  
})

app.listen(3000,()=> {
    console.log('Server running on port 3000')
})