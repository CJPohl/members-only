var express = require('express');
var router = express.Router();
const passport = require('passport');

// Controllers
const authentication_controller = require('../controllers/authenticationController');

/* GET home page. */
router.get('/', authentication_controller.index_get);

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

// New message GET
router.get('/new-message', authentication_controller.new_message_get);

// New message POST
router.post('/new-message', authentication_controller.new_message_post);

// Delete message GET
router.get('/delete-message/:id', authentication_controller.delete_message_get);

// Delete message POST
router.post('/delete-message/:id', authentication_controller.delete_message_post);

module.exports = router;
