var camp = require('../models/camp');
var Comment = require('../models/comment');

var middlewareobject ={};

middlewareobject.checklogin =function (req,res,next){
    if(req.isAuthenticated()) {
        camp.findById(req.param('id'), function (err, found) {
            //console.log(found.author.id.equals(req.user._id));
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                if(found.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    req.flash("error","You are not allowed to do that");
                    res.redirect('back');
                }
                //res.send('daffdsfds');
            }
        });
    }
    else{
        req.flash("error","please log in first");
        res.redirect('back');
    }

};

middlewareobject.commentlogin= function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id,function (err,found) {
            if(err){
                console.log(err);
            }
            else{
                if(found.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    req.flash("error","You are not allowed to do that");
                    res.redirect('back');
                }
            }

        });
    }
    else{
        req.flash("error","please log in first");
        res.redirect('/login');
    }
};

middlewareobject.isloggedin=function (req,res, next ){
    if(req.user){
        next();
    }else {
        req.flash("error","please log in first");
        res.redirect('/login');
    }

};

module.exports =middlewareobject;








