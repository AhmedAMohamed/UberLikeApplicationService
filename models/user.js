/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');
var Location = require('./Location');

var UserSchema = mongoose.Schema({
    name: {type: String, unique: false, trim: true},
    email: {type: String, unique: true, trim: true},
    password: {type: String, unique: false},
    mobile: String,
    type: String,
    reg_id: String,

    rides:[{
        from: {
            location: {
                lat: Number,
                lng: Number
            }
        },
        to: {
            location: {
                lat: Number,
                lng: Number
            }
        }
    }]
});

var users = mongoose.model('User', UserSchema);
module.exports = users;