import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import { registerSchema } from '../lib/validation.js'

export const register = async (req, res, next) => {
  try {
    const parsedBody = registerSchema.parse(req.body)

    const hashedPassword = await bcrypt.hash(parsedBody.password, 10)
    const user = await prisma.user.create({
      data: { ...parsedBody, password: hashedPassword },
    })
    res.status(201).json({ message: 'user registered successfully', user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    next(error)
  }
}
export const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const passwordMatch = bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '1w',
    })

    res
      .status(200)
      .json({ message: 'Login successful', token: `Bearer ${token}` })
  } catch (err) {
    next(err)
  }
}
export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.json({ message: 'Logged out successfully' })
  })
}
export const googleSuccessAuth = (req, res) => {
  // Handle the success case, e.g., send user info or redirect to frontend
  if (req.isAuthenticated()) {
    res
      .status(200)
      .json({ message: 'Authenticated successfully', user: req.user })
  } else {
    res.status(401).json({ message: 'Authentication failed' })
  }
}
