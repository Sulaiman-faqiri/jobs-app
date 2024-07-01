import passport from 'passport'

import prisma from './prisma.js'
import JwtStrategy from 'passport-jwt/lib/strategy.js'
import { ExtractJwt } from 'passport-jwt'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      })
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done(err, false)
    }
  })
)

export default passport
