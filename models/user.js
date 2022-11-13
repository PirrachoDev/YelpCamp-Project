const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const Campground = require('./campground');

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER', 'MODERATOR'],
    default: 'USER'
  },
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Campground'
    }
  ]
});

UserSchema.plugin(passportLocalMongoose);

/*
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
*/

UserSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const campgrounds = doc.campgrounds;
    for (let camp of campgrounds) {
      const dbCamp = await Campground.findById(camp._id);
      await Review.remove({ _id: { $in: dbCamp.reviews } })
    }
    await Campground.remove({ _id: { $in: campgrounds } });
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;