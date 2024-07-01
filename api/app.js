import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'

import authRoutes from './routes/auth_route.js'
import passport from './lib/passport.js'

dotenv.config()
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth', authRoutes)

const PORT = process.env.SERVER_PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
