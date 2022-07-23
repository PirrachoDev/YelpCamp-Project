const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { JoiCampgroundSchema, JoiReviewSchema } = require('./JoiSchemas');
const asyncCatcher = require('./utils/AsyncCatcher');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const morgan = require('morgan');
const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

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
const validateReview = (req, res, next) => {
    const { error } = JoiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})
//READ ALL
app.get('/campgrounds', asyncCatcher(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

//ADD-FORM
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//CREATE
app.post('/campgrounds', validateCampground, asyncCatcher(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

//SHOW
app.get('/campgrounds/:id', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', { campground });
}))

//UPDATE-FORM
app.get('/campgrounds/:id/edit', asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

//UPDATE
app.put('/campgrounds/:id', validateCampground, asyncCatcher(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground.id}`);
}))

//DELETE
app.delete('/campgrounds/:id', asyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

//ADD REVIEW
app.post('/campgrounds/:id/reviews', validateReview, asyncCatcher(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//DELETE REVIEW
app.delete('/campgrounds/:id/reviews/:reviewId', asyncCatcher(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

//NOT FOUND
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

//Error Handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh no! Something went wrong!';
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("SERVING PORT 3000");
});
