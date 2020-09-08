const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const CustomStrategy = require("passport-custom");
const bodyParser = require("body-parser");
const keys = require("./keys");
const {User} = require("../db/userdb");

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    return done(null, user);
  });
});

passport.use(
  "custom",
  new CustomStrategy((req, done) => {
    User.findOne({
      Email: req.body.email,
    }).then((currentUser) => {
      if (currentUser) {
        return done(null, false,req.flash("message", "User already exists"));
      } else {
        new User({
          userName: req.body.username,
          Name: req.body.username,
          Email: req.body.email,
          Password: req.body.password,
          Thumbnail:
            "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg",
        })
          .save()
          .then((newUser) => {
            console.log("created new user: ", newUser);
            return done(null, newUser);
          });
      }
    });
  })
);

passport.use(
  "login",
  new CustomStrategy((req, done) => {
    User.findOne({ Email: req.body.username }).then((user) => {
      if (!user) {
        return done(null, false, req.flash("message", "User does not exists"));
      }
      if (user.Password != req.body.password) {
        return done(
          null,
          false,
          req.flash("message", "User password is incorrect")
        );
      }
      return done(null, user);
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ Email: profile._json.email }).then((currentUser) => {
        if (currentUser) {
          console.log("user is: ", currentUser);
          return done(null, currentUser);
        } else {
          new User({
            userName: profile.displayName,
            Name: profile.name.givenName,
            Email: profile._json.email,
            Password:
              profile.name.givenName.toLowerCase() +
              getRandomArbitrary(25, 33288).toString(),
            Thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              return done(null, newUser);
            });
        }
      });
    }
  )
);
