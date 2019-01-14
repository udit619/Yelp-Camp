var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true});
//var seedDB = require('../seed');
var camp = require('../models/camp');
var Comment  = require('../models/comment');
var middleware = require('../middleware');



/*var campgrounds=[
    {name:"First One",image:"https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f4c37aa7e8b5bb_340.jpg"},
    {name:"Second One",image:"https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104491f4c37aa7e8b5bb_340.jpg"},
    {name:"Third One",image:"https://pixabay.com/get/e83db3062df51c22d2524518b7444795ea76e5d004b0144591f2c279a2edb6_340.jpg"}
];
*/
/*========================
      Passport Config
=========================*/
/*
router.use(require('express-session')({
    secret:'Mohit Namdev',
    saveUninitialized:false,
    resave:false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new localstatergy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
*/

//seedDB();

router.get('/',function (req,res) {
    camp.find({},function (err,DBcampgrounds) {
        if(err){
            req.flash("error",err.message);
            console.log(err);
        }
        else{
            //console.log(DBcampgrounds);
            res.render("./campground/campground",{campground:DBcampgrounds});
        }
    });
});

router.get('/new',middleware.isloggedin,function (req,res) {
    res.render('./campground/new');
});

router.post('/',function(req,res){
    var name= req.body.new;
    var image=req.body.image;
    var description=req.body.descr;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var naya= {
        name:name,
        image:image,
        description:description,
        author:author
    };
    camp.create(naya,function (err,campground) {
        if(err){
            req.flash("error","Sorry something went wrong");
            console.log(err);
        }
        else{
            req.flash("success","New Campground Created");
            res.redirect('/campground');
        }
    });
});



router.get('/:id',function (req,res) {
    camp.findById(req.param('id')).populate("comments").exec(function (err,found) {
        if(err){
            req.flash("error","Campground not found!");
            console.log(err)
        }
        else{
            //console.log(found);

            res.render('./campground/show',{campground: found});
        }
    });
});



router.get('/:id/comments/new',middleware.isloggedin,function (req,res) {
    camp.findById(req.param('id'),function (err,campground) {
        if(err){
            req.flash("error","Sorry something went wrong try again after logging in");
            console.log(err);
        }
        else{
            res.render('./comments/new',{campground:campground});
        }
    });
});

router.post('/:id/comments',middleware.isloggedin,function (req,res) {
    camp.findById(req.param('id'),function (err,campground) {
        if(err){
            req.flash("error","No comments found!");
            console.log(err);
            res.redirect('/campground');
        }
        else{
            Comment.create(req.body.comment,function (err,comment) {
                if(err){
                    req.flash("error","Sorry something went wrong!");
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    //console.log(req.user.username);
                    //console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully comment created");
                    res.redirect('/campground/'+campground._id);
                }
            });
        }
    });

});

router.get('/:id/comments/:comments_id/edit',middleware.commentlogin,function (req, res) {
    var campground=req.params.id;
     Comment.findById(req.params.comments_id,function (err,foundcomment) {
        if(err){
            req.flash("error","Sorry,Something went wrong. Try again after logging in");
            console.log(err);
        }
        else{
            /*
            2 hour because of comment in place of comments :(
            */
            res.render('./comments/edit',{campground:campground,foundcomment:foundcomment});
        }
    });

});


router.put('/:id/comments/:comments_id',middleware.commentlogin,function (req,res) {
            Comment.findByIdAndUpdate(req.params.comments_id,req.body.comment,function (err,update) {
            if(err){
                req.flash("error","Comment does not exists");
                console.log(errr);
            }
            else{
                req.flash("success","Comment Updated");
                res.redirect('/campground/'+req.params.id);
            }
        });

});

router.delete('/:id/comments/:comments_id',middleware.commentlogin,function (req,res) {
    Comment.findByIdAndRemove(req.params.comments_id,function (err,success) {
        if(err){
            req.flash("error","Comment does not exists");
            console.log(err);
        }
        else{
            req.flash("success","Comment Deleted");
            res.redirect('back');
        }

    });
});


router.get('/:id/edit',middleware.checklogin,function (req,res) {
        camp.findById(req.param('id'), function (err, found) {
                res.render('./campground/edit', {campground: found});
                //res.send('daffdsfds');
        });

});

router.put('/:id',middleware.checklogin,function (req,res) {
    camp.findByIdAndUpdate(req.params.id,req.body.edit ,function (err,update) {
            /*
             3.5 hours gone because of / after campground
             */
            req.flash("success","Campground Updated");
            res.redirect('/campground/'+ update._id);

    });
});

router.delete('/:id',middleware.checklogin,function (req,res) {
    camp.findByIdAndRemove(req.params.id,function (err,success) {
        if(err){
            console.log(err);
            req.flash("error","The file does not exists!!!");
            res.redirect('/campground');
        }
        else{
            req.flash("success","Campground Deleted");
            res.redirect('/campground');
        }

    });
});


module.exports=router;

