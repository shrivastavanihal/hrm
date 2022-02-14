const { Router } = require("express");
const UserSchema = require("../Model/Auth");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = Router(); //top-level function

/*@HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/register
*/
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});

/*@HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/login
*/
router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});

/*@HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/logout
*/
router.get("/logout", async (req, res) => {
  req.logOut();
  req.flash("SUCCESS_MESSAGE", "successfully logged out!");
  res.redirect("/auth/login", 302, {})
})

/*@HTTP POST REQUEST
@ACCESS PUBLIC
@URL /auth/register
*/
router.post("/register", async (req, res) => {
  //server side validation
  let { username, email, password, password1 } = req.body;

  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (username.length < 6) {
    errors.push({ text: "At leat 6 character's" });
  }
  if (!email) {
    errors.push({ text: "email is required" });
  }
  if (!password) {
    errors.push({ text: "password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "password is not match" });
  }
  if (errors.length > 0) {
    // req.flash("errors", "failed to register");
    res.render("../views/auth/register", {
      errors,
      username,
      email,
      password,
      password1,
    });
  } else {
    let user = await UserSchema.findOne({ email:email });
    if (user) {
      // errors.push({ text: "Email already exists" });
      req.flash("ERROR_MESSAGE", "Email already exists");
      res.redirect("/auth/register", 302, {});
    } else {
      let newUser = new UserSchema({
        username,
        email,
        password,
      });

      bcrypt.genSalt(12, (err, salt)=>{
        // console.log(salt);
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          // console.log(hash);
          if (err) throw err;
          newUser.password = hash;
          await newUser.save();
          req.flash("SUCCESS_MESSAGE", "succesfully registered");
          res.redirect("/auth/login", 302, {});
        });
      });
    }
  }
});

/*@HTTP POST REQUEST
@ACCESS PUBLIC
@URL /auth/login
*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/home",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
