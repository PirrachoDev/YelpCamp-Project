const Joi = require('joi');

module.exports.JoiCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.JoiReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

//I made this just to try
module.exports.JoiUserSchema = Joi.object({
    username: Joi.string().required().min(4),
    password: Joi.string().required().min(8),
    email: Joi.string().required()
})