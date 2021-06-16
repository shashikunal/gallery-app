const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//LOAD AUTH SCHEMA
const USER = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await USER.findOne({ email });
        //checking username
        if (!user) {
          return done(null, false, {
            message: `email doesn't exit please create an account ... `,
          });
        }
        //verifying password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: ` Incorrect Password` });
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    USER.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
