import express, {Request, Response, NextFunction} from 'express'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
import userRouter from './routes/user.routes'
import transactionRouter from './routes/transaction.routes'
dotenv.config()


const app = express()

app.use(cors({
  origin: "http://localhost:4323", // Astro url
  credentials: true // Allow cookies from frontend
}))

if(!process.env.COOKIE_PRIMARY_KEY|| !process.env.COOKIE_SECONDARY_KEY){
    throw new Error("Missing cookie keys!")
}

app.use(cookieSession({
    name:"session",
    keys:[
        process.env.COOKIE_PRIMARY_KEY,
        process.env.COOKIE_SECONDARY_KEY
    ],
    // maxAge:3*60*1000*10
}))
app.use(express.json())

app.use('/users',userRouter)
app.use('/transactions',transactionRouter)

app.use((req:Request, res:Response, next:NextFunction)=>{
    res.status(400).json({
        message:"Invalid route!"
    })
})

const PORT = process.env.PORT

if(!PORT){
    throw new Error("Missing port!")
}
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})