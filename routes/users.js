const express = require('express');
const passport = require('passport');
const router = express.Router();
const asyncCatcher = require('../utils/AsyncCatcher');
const { isLoggedIn, validateUser } = require('../middleware');
const { isAuthorized } = require('../middlewares/users');

const userController = require('../controllers/users');

router.route('/users') //ADD MIDDLEWARE AUTH LATER
    .get(isLoggedIn, isAuthorized('READ'), asyncCatcher(userController.index))

router.route('/users/:userId')
    .get(isLoggedIn, isAuthorized('READ'), asyncCatcher(userController.showUser))
    .put(isLoggedIn, isAuthorized('UPDATE'), userController.updateUser)
    .delete(isLoggedIn, isAuthorized('DELETE'), userController.deleteUser)

router.route('/users/:userId/edit')
    .get(isLoggedIn, isAuthorized('READ'), userController.renderEditForm)

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(validateUser, asyncCatcher(userController.register))

router.route('/login')
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), asyncCatcher(userController.login))

router.get('/logout', isLoggedIn, userController.logout);

module.exports = router;