const express = require("express");
const router = require("express").Router();
const passport = require("passport");
const app = require("../app")
router.use(express.urlencoded({extended : true}));
router.post(
  "/login", function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
      var err = req.flash('message') || [];
      if (err[0] === 'User does not exists') {
        req.flash('message', 'User does not exists');
       res.redirect('/register');
        
      }
    else if (err[0] === 'User password is incorrect') {
      req.flash('message', 'User password is incorrect')
      res.redirect('/login');
    } 
    req.logIn(user,function(err){
      if(err){
        return next(err);}
      return res.redirect('/profile');
    });

      })(req, res, next)
    });
  
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/home", (req, res) => {
  res.render("home");
});
router.post(
  "/register",function(req, res, next) {
    passport.authenticate('custom', function(err, user, info) {
      var err = req.flash('message') || [];
    if (err[0] === 'User already exists') {
       req.flash('message', 'User already exists');
       res.redirect('/register');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/profile');
    });
      })(req, res, next)
    });

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Hello");
  res.redirect("/profile");
});


module.exports = router;
