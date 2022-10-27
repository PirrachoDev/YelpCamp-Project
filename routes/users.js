const express = require('express');
const passport = require('passport');
const router = express.Router();
const asyncCatcher = require('../utils/AsyncCatcher');
const { isLoggedIn, validateUser } = require('../middleware');
const { grantAccess, isProtected } = require('../middlewares/users');

const userController = require('../controllers/users');

router.route('/users') //ADD MIDDLEWARE AUTH LATER
    .get(isLoggedIn, isProtected('MODERATOR'), asyncCatcher(userController.index))

router.route('/users/:id')
    .get(isLoggedIn, asyncCatcher(userController.showUser))
    .put(isLoggedIn, userController.updateUser)
    .delete(userController.deleteUser)

router.route('/users/:id/edit')
    .get(isLoggedIn, userController.renderEditForm)

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(validateUser, asyncCatcher(userController.register))

router.route('/login')
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), asyncCatcher(userController.login))

router.get('/logout', isLoggedIn, userController.logout);

module.exports = router;