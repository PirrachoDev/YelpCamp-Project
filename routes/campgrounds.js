const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utils/AsyncCatcher');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { JoiCampgroundSchema } = require('../JoiSchemas');

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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

//CREATE
router.post('/', validateCampground, asyncCatcher(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

//SHOW
router.get('/:id', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', { campground });
}))

//UPDATE-FORM
router.get('/:id/edit', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

//UPDATE
router.put('/:id', validateCampground, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground.id}`);
}))

//DELETE
router.delete('/:id', asyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;