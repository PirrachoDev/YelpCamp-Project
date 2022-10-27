const User = require('../models/user');

module.exports.grantAccess = async (req, res, next) => {

    // const user = await User.findById(req.user._id);
    // const role = user.role;
    // if (!protected && role === 'USER') {
    //     const { id } = req.params;
    //     const campground = await Campground.findById(id);
    //     if (!campground.author.equals(req.user._id)) {
    //         req.flash('error', "You don't have the permission to do that.");
    //         return res.redirect(`/campgrounds/${id}`);
    //     }
    //     next();
    // } else {
    //     req.flash('error', 'An error has occurred.');
    //     return res.redirect('/campgrounds');
    // }

}

module.exports.isProtected = (authLevel) => {
    return (req, res, next) => {
        switch (authLevel) {
            case 'MODERATOR':
                const authUsers = ['MODERATOR', 'ADMIN'];
                const isIncluded = authUsers.includes(req.user.role);
                if (!isIncluded) {
                    req.flash('error', 'You are not authorized.');
                    return res.redirect(`/users/${req.user._id}`);
                }
                next();
                break;
            case 'ADMIN':
                if (req.user.role != 'ADMIN') {
                    req.flash('error', 'You are not authorized.');
                    return res.redirect(`/users/${req.user._id}`);
                }
                next();
                break;
            default:
                req.flash('error', 'You are not authorized.');
                return res.redirect(`/users/${req.user._id}`);
        }
    }
}
