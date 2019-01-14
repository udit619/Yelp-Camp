var express = require('express');
var router = express.Router();


router.get('/',function (req,res) {
   req.logout();
   req.flash("success","Successfully logged out");
   res.redirect('/campground');
});

module.exports=router;