const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const asyncCatcher = require('../utils/AsyncCatcher');
const isLoggedIn = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', asyncCatcher(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }

}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), asyncCatcher(async (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    res.redirect('/campgrounds');
}))

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        };
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });

})

module.exports = router;