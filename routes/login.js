var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended: true}));
var User = require('../models/user');
//passport.use(new localStatergy(User.authenticate()));
//router.use(passport.initialize());
//router.use(passport.session());


router.get('/',function (req,res) {
    res.render('login');
});

router.post('/',passport.authenticate('local',{
    successRedirect:'/campground',
    failureRedirect:'/login'
}),function (req,res) {
    req.flash("success","Successfully logged in");
});




module.exports = router;