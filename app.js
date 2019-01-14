var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport =require('passport');
var localstatergy = require('passport-local');
var User = require('./models/user');
var logout = require('./routes/logout');
var methodoverride = require('method-override');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var campground = require('./routes/campground');
var register = require('./routes/register');
var login = require('./routes/login');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(passport.initialize());

app.use(require('express-session')({
    secret:'Mohit Namdev',
    saveUninitialized:false,
    resave:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req,res,next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/', indexRouter);
app.use('/campground',campground);
app.use('/register',register);
app.use('/login',login);
app.use('/logout',logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3000,function () {
    console.log("Started");
});

module.exports = app;
