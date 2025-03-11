import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

const app: Application = express()

//parsers
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: [
      `http://localhost:3000`,
      `https://vanishvote-frontend-tau.vercel.app`,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// application routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to VanishVote !!!')
})

app.use(globalErrorHandler)

//Not Found
app.use(notFound)

export default app
