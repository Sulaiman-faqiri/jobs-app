import { z } from 'zod'

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'first_name must be 3 or more characters long' })
    .max(20, { message: 'first_name must not be more than 20 characters' }),
  last_name: z
    .string()
    .min(3, { message: 'last_name must be 3 or more characters long' })
    .max(20, { message: 'last_name must not be more than 20 characters' }),
  email: z.string().email('invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
  phone_number: z.string().optional(),
  user_type: z.enum(['JobSeeker', 'Employer'], 'Invalid user type'),
})
