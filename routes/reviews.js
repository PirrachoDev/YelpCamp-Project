const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utils/AsyncCatcher');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const reviewController = require('../controllers/reviews');



//CREATE REVIEW
router.post('/', isLoggedIn, validateReview, asyncCatcher(reviewController.createReview));

//DELETE REVIEW
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncCatcher(reviewController.deleteReview));

module.exports = router;