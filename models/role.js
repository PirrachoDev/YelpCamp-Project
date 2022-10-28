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
    }
})

roleSchema.pre('save', function (next) {
    const role = this;
    const auth = {};
    switch (role.role) {
        case 'USER':
            auth = {
                READ: ['SELF'],
                UPDATE: ['SELF'],
                DELETE: ['SELF']
            }
            break;
        case 'MODERATOR':
            auth = {
                READ: ['SELF', 'OTHER'],
                UPDATE: ['SELF', 'OTHER'],
                DELETE: ['SELF']
            }
            break;
        case 'ADMIN':
            auth = {
                READ: ['SELF', 'OTHER'],
                UPDATE: ['SELF', 'OTHER'],
                DELETE: ['SELF', 'OTHER']
            }
            break;
        default:
            throw new Error();
    }
    role.auth = auth;
    next();
})

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;