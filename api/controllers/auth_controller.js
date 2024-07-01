import bcrypt from 'bcryptjs'
import { registerSchema } from '../lib/validation.js'
import prisma from '../lib/prisma.js'
import { z } from 'zod'

export const register = async (req, res, next) => {
  try {
    const parsedBody = registerSchema.parse(req.body)

    const hashedPassword = await bcrypt.hash(password, 10)
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
export const login = (req, res, next) => {
  res.send('it worked')
}
export const logout = (req, res) => {
  req.logout()
  res.json({ message: 'Logged out successfully' })
}
