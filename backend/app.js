import express from 'express' 
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import HandleError from './utils/handleError.js'
import catchError from './utils/catchError.js'
import authRouter from './Routes/auth.js'
import nobitexRouter from './Routes/nobitex.js'
import cookieParser from 'cookie-parser'
import authMiddleware from './Middleware/authMiddleware.js'

const app = express()
dotenv.config({path:"./.env"})
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // برای ارسال کوکی‌ها ضروری است
  }));
  app.use(cookieParser());

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/nobitex',authMiddleware,nobitexRouter)
app.use('*',(req,res,next)=>{
    next(new HandleError("مسیر پیدا نشد !",404))
})
app.use(catchError)
export default app;