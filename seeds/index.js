const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
//const dbUrl = process.env['DB_URL']; //Replit
const dbUrl = /*process.env.DB_URL || */'mongodb://localhost:27017/yelp-camp'; //VSCode


mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DATABASE CONNECTED');
});

//const authorVariable = '633e5b8d5ee5cd0cba28950e'; //Replit
const authorVariable = '6360b04053fa91a4e9fa5a2d'; //VSCode
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  await User.findByIdAndUpdate(authorVariable, { campgrounds: [] });
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: authorVariable,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/pirrachodev/image/upload/v1667499238/YelpCamp/riii5sivnalmdvslf69p.jpg',
          filename: 'YelpCamp/riii5sivnalmdvslf69p'
        },
        {
          url: 'https://res.cloudinary.com/pirrachodev/image/upload/v1667485381/YelpCamp/ofnxhurx64urncpj0jtt.jpg',
          filename: 'YelpCamp/ofnxhurx64urncpj0jtt'
        }
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, eligendi! Repellendus repudiandae laborum consequatur corporis, reiciendis distinctio omnis consectetur nulla eius provident dicta adipisci, officia, modi atque sit recusandae ad?',
      price //this is a shorthand notation, is same as 'price: price'
    });
    await camp.save();
    const user = await User.findById(authorVariable); //New: Adding campground to user db
    user.campgrounds.push(camp);                      //New: Adding campground to user db
    await user.save();                                //New: Adding campground to user db
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});

