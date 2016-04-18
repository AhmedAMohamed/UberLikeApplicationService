/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');
var UserSchema = require('./user');
var Location = require('./Location');

var driversSchema = mongoose.Schema({
    personalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentPth: [{
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
        time: Number
    }],
    car: {
        color: String,
        carNumber: String,
        model: String
    },
    avatar: String
});

var driver = mongoose.model('Driver', driversSchema);
module.exports = driver;