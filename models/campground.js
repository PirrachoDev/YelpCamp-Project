const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: {
        type: String,
        default: 'https://source.unsplash.com/collection/483251'
    },
    price: Number,
    description: {
        type: String,
        default: 'This is just the default text in case you leave the field empty'
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//POST DELETING MIDDLEWARE 
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);


module.exports = Campground;

//We could've also done it without compiling or saving the model into a variable:
//<< module.exports = mongoose.model('Campground', CampgroundSchema); >>