var express = require('express');
var router = express.Router();
const passport = require('passport');

// Controllers
const authentication_controller = require('../controllers/authenticationController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

// Sign up GET
router.get('/sign-up', authentication_controller.signup_get);

// Sign up POST
router.post('/sign-up', authentication_controller.signup_post);

// Login GET
router.get('/login', authentication_controller.login_get);

// Login POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout GET
router.get('/logout', authentication_controller.logout_get);

module.exports = router;
