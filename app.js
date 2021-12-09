require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const User = require('./models/user');

var indexRouter = require('./routes/index');

var app = express();

// Connect MongoDb
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_PASS;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Passport Authentication
passport.use('local',
  new LocalStrategy({usernameField: 'email'},(username, password, done) => {
    User.findOne({ 'email': username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);

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

module.exports = app;
