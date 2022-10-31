const mongoose = require('mongoose');
const Role = require('../models/role');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

const seedDB = async () => {
    await Role.deleteMany({});
    const user = new Role({
        role: 'USER',
        auth: {
            READ: ['SELF'],
            UPDATE: ['SELF'],
            DELETE: ['SELF']
        }
    });

    const mod = new Role({
        role: 'MODERATOR',
        auth: {
            READ: ['SELF', 'OTHER'],
            UPDATE: ['SELF', 'OTHER'],
            DELETE: ['SELF']
        }
    });

    const admin = new Role({
        role: 'ADMIN',
        auth: {
            READ: ['SELF', 'OTHER'],
            UPDATE: ['SELF', 'OTHER'],
            DELETE: ['SELF', 'OTHER']
        }
    });
    await user.save();
    await mod.save();
    await admin.save();
}

seedDB().then(() => {
    mongoose.connection.close()
});