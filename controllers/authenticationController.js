const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Message = require('../models/message');


// Index GET
exports.index_get = function(req, res, next) {
    Message.find()
    .populate('user')
    .sort({timestamp: -1})
    .limit(5)
    .exec(function(err, message_list) {
        if (err) { return next(err); }
        // Success
        res.render('index', {messages: message_list});
    });
}

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

// New message GET
exports.new_message_get = function(req, res) {
    (req.user) ? res.render('new_message') : res.redirect('/');
}

// New message POST
exports.new_message_post = [

    // Sanitation and Validation
    body('new_message_title').trim().notEmpty().escape(),
    body('new_message_text').trim().notEmpty().escape(),

    // Process req
    (req, res, next) => {

        // Extract errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('new-message', {errors: errors.array()});
            return;
        }
        else {
            // Query User
            User.findById(req.user.id)
            .exec(function(err, user) {
                if (err) { return next(err); }
                // Success
                const message = new Message(
                    {
                        title: req.body.new_message_title,
                        text: req.body.new_message_text,
                        user: user
                    }
                );

                message.save(function (err) {
                    if (err) { return next(err); }
                    // Success
                    res.redirect('/');
                });
            });  
        }   
    }
]

exports.delete_message_get = function(req, res, next) {
    Message.findById(req.params.id)
    .exec(function (err, message) {
        if (err) { return next(err); }
        // Success
        res.render('delete_message');
    });
}

exports.delete_message_post = function(req, res, next) {
    Message.findByIdAndDelete(req.params.id, function(err) {
        if (err) { return next(err); }
        // Success
        res.redirect('/index');
    });
}