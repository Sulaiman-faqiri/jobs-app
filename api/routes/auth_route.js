import express from 'express'
import passport from '../lib/passport.js'
import passportGoogle from '../lib/passport-google.js'
import passportJwt from '../lib/passport.js'
import {
  googleSuccessAuth,
  login,
  logout,
  register,
} from '../controllers/auth_controller.js'

const router = express.Router()

router.get(
  '/google',
  passportGoogle.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to success endpoint

    res.redirect('/api/auth/google/success')
  }
)

router.get('/google/success', googleSuccessAuth)

router.get(
  '/protected',
  passportJwt.authenticate('jwt', { session: false }),
  (req, res) => {
    res
      .status(200)
      .json({ message: 'You have accessed a protected route', user: req.user })
  }
)

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

export default router
