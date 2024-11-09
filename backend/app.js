import express from 'express' 
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import HandleError from './utils/handleError.js'

dotenv.config({path:"./.env"})
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

// app.use('/api/v1/auth')
// app.use('/api/v1/dashboard')
app.use('*',(req,res,next)=>{
    next(new HandleError("مسیر پیدا نشد !",404))
})

export default app;