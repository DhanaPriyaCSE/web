const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const sslRedirect = require('heroku-ssl-redirect');
const mongoose = require("mongoose");
var flash = require("connect-flash");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/login-setup");
const keys = require("./config/keys");
const { callpaper, callproposal, callfellowship } = require("./db/userdb");

const app = new express();
app.use(sslRedirect());
app.set("view engine", "ejs");
app.enable("trust proxy");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const authCheck = (req, res, next) => {
    if (req.user) {
        res.redirect("/profile");
    } else {
        next();
    }
};
const adminCheck = (req, res, next) => {
    if (req.user.admin && req.user) {
        next();
    } else {
        req.flash('message', 'Login as Admin!!');
        res.redirect('/login');
    }
}
app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [keys.session.cookieKey],
    })
);
app.use(flash());
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, (error) => {
    if (!error) {
        console.log("connected to mongodb");
    } else {
        console.log(error);
    }
});

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.get('/', authCheck, (req, res) => {
    callpaper.find().populate('typeofpaper').populate('indexedin').sort({ publishdate: -1 }).then((paperDetails) => {
        if (paperDetails) {
            callfellowship.find().populate('typeoffellowship').populate('university').sort({ publishdate: -1 }).then((fellowShipDetails) => {
                if (fellowShipDetails) {
                    callproposal.find().populate('fundingagency').populate('discipline').sort({ publishdate: -1 }).then((proposalDetails) => {
                        if (proposalDetails) {
                            res.render('home', { errMsg: '', paperDetails: paperDetails[0], fellowShipDetails: fellowShipDetails[0], proposalDetails: proposalDetails[0], noOfPapers: paperDetails.length, noOfProposals: proposalDetails.length, noOfFellowships: fellowShipDetails.length })
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }).catch(err => {
                console.log(err);
            });

        }
    }).catch(err => {
        console.log(err);
    });
});
app.get('/home', authCheck, (req, res) => {
    callpaper.find().populate('typeofpaper').populate('indexedin').sort({ publishdate: -1 }).then((paperDetails) => {
        if (paperDetails) {
            callfellowship.find().populate('typeoffellowship').populate('university').sort({ publishdate: -1 }).then((fellowShipDetails) => {
                if (fellowShipDetails) {
                    callproposal.find().populate('fundingagency').populate('discipline').sort({ publishdate: -1 }).then((proposalDetails) => {
                        if (proposalDetails) {
                            res.render('home', { errMsg: '', paperDetails: paperDetails[0], fellowShipDetails: fellowShipDetails[0], proposalDetails: proposalDetails[0], noOfPapers: paperDetails.length, noOfProposals: proposalDetails.length, noOfFellowships: fellowShipDetails.length })
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }).catch(err => {
                console.log(err);
            });

        }
    }).catch(err => {
        console.log(err);
    });
});
app.get('/login', authCheck, (req, res) => {
    var err = req.flash('message') || [];
    if (err[0] === 'User password is incorrect') {
        var errMsg = 'Your Password is Incorrect \n Please Try Again';
        res.render('login', {
            errMsg: errMsg
        });
    } else if (err[0] === 'Login as Admin!!') {
        var errMsg = 'Please login as an Admin!!';
        res.render('login', {
            errMsg: errMsg
        });
    } else {
        res.render('login', { errMsg: '' });
    }
});
app.get('/register', (req, res) => {
    var err = req.flash('message') || [];
    if (err[0] === 'User does not exists') {
        var errMsg = 'Your Account Does Not Exists \n Please Register!';
        res.render('register', { errMsg: errMsg });
    } else if (err[0] === 'User already exists') {
        var errMsg = 'User account already exists! \n Please Try Again';
        res.render('register', {
            errMsg: errMsg
        });
    } else {
        res.render('register', { errMsg: null });
    }
});
app.listen(process.env.PORT || 3000);