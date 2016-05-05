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
    // Driver status {available, busy, out of service}
    status: {
        type: String, default: "available"
    },
    currentLocation: {
        type: [Number],
        index: '2d'
    },
    currentRide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    },
    car: {
        color: String,
        carNumber: String,
        model: String
    },
    avatar: String
});

var driver = mongoose.model('Driver', driversSchema);
module.exports = driver;