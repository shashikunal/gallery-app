const express = require("express");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { connect } = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

const { PORT, SERVER, DB_URL } = require("./Config");

let app = express();

/*-----register handlebars helper middleware -----*/
handlebars.registerHelper("TrimString", str => str.slice(6));
handlebars.registerHelper("mimetype", obj => {
  if (obj === "video/webm" || obj === "video/mp4") {
    return obj;
  }
});

/*-----------------middleware starts here ---------------------------*/
require("./Config/passport")(passport);
/*----------CONNECTION  DATABASE  STARTS HERE ----------------------*/

connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  },
  err => {
    if (err) throw err;
    console.log("DATABASE SUCCESSFULLY CONNECTED ");
  }
);

/*----------CONNECTION  DATABASE  ENDS HERE ----------------------*/

app.engine("handlebars", exphbs({}));
app.set("view engine", "handlebars");
/*-----------------middleware ends here -----------------------------*/

/*----------SERVE STATIC FILES STARTS HERE ----------------------*/
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));
/*----------SERVE STATIC FILES ENDS HERE----------------------*/

/*---------------------connect flash and cookie parser and session middlewares ------*/

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

/*----------URL ENCODED STARTS HERE ----------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/*----------URL ENCODED ENDS HERE ----------------------*/
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  // console.log((res.locals.shashi = "i am chombu")); //set Global Variables
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERRORS_MESSAGE = req.flash("ERRORS_MESSAGE");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//basic home route
app.get("/", (req, res) => {
  res.render("home");
});

//Gallery Routing
app.use("/gallery", require("./Routes/gallery"));
//Authentication Routing   with
app.use("/auth", require("./Routes/auth"));
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`My ${SERVER} is running on PORT number ` + PORT);
});
