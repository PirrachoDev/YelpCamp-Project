const Campground = require('./models/campground');
const { JoiCampgroundSchema, JoiUserSchema, JoiReviewSchema } = require('./JoiSchemas');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = JoiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = JoiUserSchema.validate(req.body);
    if (error) {
        //const msg = error.details.map(el => el.message).join(',');
        //throw new ExpressError(msg, 400);
        req.flash('error', error.message);
        res.redirect('/register');
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have the permission to do that.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = JoiCampgroundSchema.validate(req.body);
    if (error) {
        req.flash('error', error.message);
        res.redirect('/campgrounds/new');
    } else {
        next();
    }
}

