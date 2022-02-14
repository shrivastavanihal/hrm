const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
//load auth schema;
const UserSchema = require("../Model/Auth"); // to validate

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await UserSchema.findOne({ email: email });
        //checking user exists or not
        if (!user) {
          return done(null, false, { message: "User does not exists.." });
        }
        // else {
        //   done(null, user, "successfully logged in!!");
        // }

        //match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return done(null, false, { message: "Password is not matching" });
          } else {
            return done(null, user);
          }
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    UserSchema.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
