const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6307ef32f6fc6323d7599421',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/pirrachodev/image/upload/v1662004503/YelpCamp/iysdce4yftuey91itjo3.jpg',
                    filename: 'YelpCamp/iysdce4yftuey91itjo3'
                },
                {
                    url: 'https://res.cloudinary.com/pirrachodev/image/upload/v1662004504/YelpCamp/wsjczux4lplrd59npshr.png',
                    filename: 'YelpCamp/wsjczux4lplrd59npshr'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, eligendi! Repellendus repudiandae laborum consequatur corporis, reiciendis distinctio omnis consectetur nulla eius provident dicta adipisci, officia, modi atque sit recusandae ad?',
            price //this is a shorthand notation, is same as 'price: price'
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

