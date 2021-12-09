const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');


// Signup GET
exports.signup_get = function(req, res, next) {
    res.render('signup');
}

// Signup POST
exports.signup_post = [

    // Sanitation and Validation
    body('user_first_name').trim().notEmpty().escape(),
    body('user_last_name').trim().notEmpty().escape(),
    body('user_email').trim().notEmpty().isEmail().bail(),
    body('user_password').notEmpty(),
    body('user_confirm_password', 'Password Confirmation field must have same value as the password field').notEmpty().custom((value, {req}) => value===req.body.user_password),
    body('user_secret_code').optional({checkFalsy: true}).trim().escape(),

    // Process req
    (req, res, next) => {

        // Extract errors
        const errors = validationResult(req);

        // User Object
        const user = new User({
            first_name: req.body.user_first_name,
            last_name: req.body.user_last_name,
            email: req.body.user_email,
            password: bcrypt.hashSync(req.body.user_password, 8),
            member: (req.body.user_secret_code==='tuna_sandwich') ? true : false,
            admin: false
        });

        if (!errors.isEmpty()) {
            res.render('signup', {errors: errors.array()});
            return;
        }
        else {
            user.save(function(err) {
                if (err) {return next(err); }
                // Success
                res.redirect('/login');
            });
        }
    }
]

// Login GET
exports.login_get = function(req, res, next) {
    res.render('login', {messages: req.flash('message')});
}

// Logout GET
exports.logout_get = function(req, res) {
    req.logout();
    res.redirect('/');
}