/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');
var UserSchema = require('./user');

var driversSchema = mongoose.Schema({
    personalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentLocation: {
        type: [Number],
        index: '2d'
    },
    currentPath: [{
        location: {
            type: [Number],
            index: '2d'
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