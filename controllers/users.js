const User = require('../models/user');

module.exports.index = async (req, res) => {
    const users = await User.find({});
    res.render('users/index', { users });
}

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', 'User could not be found...');
            res.redirect('/users')
        } else {
            res.render('users/edit', { user })
        }
    }
    catch (error) {
        //Hay un area de oportunidad, podria mostrarse un mejor mensaje para error de cast
        req.flash('error', error.message);
        res.redirect('/users');
    }
}

module.exports.showUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', 'User could not be found...');
            res.redirect('/users')
        } else {
            res.render('users/show', { user })
        }
    }
    catch (error) {
        //Hay un area de oportunidad, podria mostrarse un mejor mensaje para error de cast
        req.flash('error', error.message);
        res.redirect('/users');
    }
}

module.exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, req.body);
        const user = await User.findById(id);
        console.log(user);
        req.flash('success', 'User info updated');
        res.redirect('/campgrounds');
    }
    catch (error) {
        next(error);
    }
}

module.exports.deleteUser = (req, res) => {
    req.flash('error', 'User deleted');
    res.redirect('/users');
}

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (error) {
        if (error.keyPattern && error.keyPattern.email === 1) {
            req.flash('error', 'It seems like that email is already registered');
            res.redirect('/register');
        } else {
            req.flash('error', error.message);
            res.redirect('/register');
        }
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        };
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });

}

