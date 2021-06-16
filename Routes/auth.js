const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
//LOAD AUTH SCHEMA
let USER = require("../Model/Auth");

/*-----------ALL GET ROUTES STARTS HERE-----------------*/
router.get("/register", (req, res) => {
  res.render("./auth/Register");
});

//!todo ============================LOGIN GET ROUTE STARTS HERE ======================= /
router.get("/login", (req, res) => {
  res.render("./auth/Login");
});

/*-----------ALL LOGOUT ROUTES STARTS HERE-----------------*/
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("SUCCESS_MESSAGE", "successfully logged out");
  res.redirect("/auth/login", 301, () => {});
});
/*-----------ALL LOGOUT ROUTES ENDS HERE-----------------*/

/*-----------ALL GET ROUTES ENDS HERE-----------------*/

//!todo ============================LOGIN POST ROUTE STARTS HERE ======================= /
router.post("/login", (req, res, next) => {
  //needed local strategy
  passport.authenticate("local", {
    successRedirect: "/gallery",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

//!todo ============================LOGIN GET ROUTE  ENDS HERE======================= /
/*-----------ALL POST ROUTES STARTS HERE-----------------*/
router.post("/register", async (req, res) => {
  let { username, email, password, confirmpassword } = req.body;
  try {
    let errors = [];
    if (password !== confirmpassword) {
      errors.push({ text: "Password is not match" });
    }
    if (password < 6) {
      errors.push({ text: "Password should be minimum 6 characters" });
    }

    if (username === "" || username === null) {
      errors.push({ text: "Username is Required" });
    }
    if (email === "" || email === null) {
      errors.push({ text: "email is Required" });
    }
    if (password === "" || password === null) {
      errors.push({ text: "password is Required" });
    }

    //error length > 0
    if (errors.length > 0) {
      res.render("./auth/Register", {
        errors,
        username,
        email,
        password,
        confirmpassword,
      });
    } else {
      //need to check email address registered in mongodb or not
      let RegisterInfo = await USER.findOne({ email });
      if (RegisterInfo) {
        console.log("Email Address already registered please try new one");
        res.redirect("/auth/register", 301, () => {});
      } else {
        let newUser = new USER({
          username,
          email,
          password,
        });
        bcrypt.genSalt(12, (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            console.log(hash);
            newUser.password = hash;
            await newUser.save();
            req.flash("SUCCESS_MESSAGE", "successfully users Registered");
            res.redirect("/", 301, () => {});
          });
        });
      }
    }
  } catch {
    console.log("err");
  }
});

/*-----------ALL POST ROUTES ENDS HERE-----------------*/

module.exports = router;
