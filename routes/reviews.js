const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utils/AsyncCatcher');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { JoiReviewSchema } = require('../JoiSchemas');

//Backend validators
const validateReview = (req, res, next) => {
    const { error } = JoiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//CREATE REVIEW
router.post('/', validateReview, asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully posted!, Thank you!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//DELETE REVIEW
router.delete('/:reviewId', asyncCatcher(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;