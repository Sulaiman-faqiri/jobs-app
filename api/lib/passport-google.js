import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './prisma.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GoogleCallbackUrl,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log(profile)
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              email: profile.emails[0].value,
              user_type: 'JOBSEEKER',
              emailVerified: true,
            },
          })

          await prisma.account.create({
            data: {
              userId: user.user_id,
              provider: 'google',
              providerAccountId: profile.id,
              access_token: token,
              refresh_token: tokenSecret,
              // Add other fields if available
            },
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.user_id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { user_id: id } })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

export default passport
