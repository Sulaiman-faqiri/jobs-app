import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth_route.js'
dotenv.config()
const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(process.env.SERVER_PORT || 5000, () => {
  console.log('server is running onn ' + process.env.SERVER_PORT)
})
