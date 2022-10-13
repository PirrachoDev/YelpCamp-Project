const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;