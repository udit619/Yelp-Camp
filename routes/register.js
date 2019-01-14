var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


router.get('/',function (req,res) {
        res.render('register');
});

router.post('/',function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    User.register(new User({username:username}) ,password,function (err,user) {
        if(err){
            req.flash("error",err.message);
            console.log(err);
            res.render('register');
        }
        else{
            req.flash("success","Successfully signed in");
            passport.authenticate('local')(req,res,function () {
                res.redirect('/campground');
            });
        }
    });
});




module.exports=router;



