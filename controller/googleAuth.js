const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/user/google/callback"
  //change to process.env.CALLBACK_URL
},
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user)
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});