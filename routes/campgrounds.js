const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utils/AsyncCatcher');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { JoiCampgroundSchema } = require('../JoiSchemas');
const isLoggedIn = require('../middleware');

//Backend Validator Middlewares
const validateCampground = (req, res, next) => {
    const { error } = JoiCampgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//READ ALL
router.get('/', asyncCatcher(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

//ADD-FORM
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

//CREATE
router.post('/', isLoggedIn, validateCampground, asyncCatcher(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

//SHOW
router.get('/:id', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

//EDIT-FORM
router.get('/:id/edit', isLoggedIn, asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

//UPDATE
router.put('/:id', isLoggedIn, validateCampground, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`);
}))

//DELETE
router.delete('/:id', isLoggedIn, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router;