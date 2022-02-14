//Express JS follows mvc architecture
const express = require("express");
const { connect } = require("mongoose"); // only extracting connect function from mongoose library..
const { engine } = require("express-handlebars");
const { join } = require("path");
const Handlebars = require("handlebars");
const methodOverride = require("method-override"); // To change Post to put
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");


//load env files from config
const { PORT, MONGODB_URL } = require("./config");

//importing routing files
const EmployeeRoute = require("./Route/employee");
const AuthRoute = require("./Route/auth");
require("./middlewares/passport")(passport);

const app = express(); //top level function

//! =================Database connection STARTS here================//
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("Database Connected");
};
DatabaseConnection();
//! =================Database connection ENDS here==================//

//?========to do TEMPLATE ENGINE MIDDLEWARE STARTS HERE=======//
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//?=======to do TEMPLATE ENGINE MIDDLEWARE ENDS HERE============//


//?=============Built-in MIDDLEWARE STARTS HERE==============//
app.use(express.static(join(__dirname, "Public")));// for static pages 
app.use(express.static(join(__dirname, "node_modules")));// for bootstrap and dependencies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());
//?===========Built-in MIDDLEWARE ENDS HERE=================//

//*************Handlebars HELPER CLASS****************
Handlebars.registerHelper("trimString", function (passedString) {
  let theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

//new***
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

//set the global variables
app.use((req, res, next) => {
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});


app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);

//listen a port
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is running on the port number ${PORT}`);
});
