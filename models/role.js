const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roleSchema = new Schema({
    role: {
        type: String,
        enum: ['ADMIN', 'USER', 'MODERATOR'],
        default: 'USER'
    },
    auth: {
        READ: {
            type: [String]
        },
        UPDATE: {
            type: [String]
        },
        DELETE: {
            type: [String]
        }
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;