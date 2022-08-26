const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utils/AsyncCatcher');
const Campground = require('../models/campground');
const { isAuthor, isLoggedIn, validateCampground } = require('../middleware');

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
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

//SHOW
router.get('/:id', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews')
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

//EDIT-FORM
router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

//UPDATE
router.put('/:id', isLoggedIn, isAuthor, validateCampground, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.id}`);
}))

//DELETE
router.delete('/:id', isLoggedIn, isAuthor, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router;