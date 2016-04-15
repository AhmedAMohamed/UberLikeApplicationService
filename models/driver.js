/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');
var UserSchema = require('./user');
var Location = require('./Location');

var driversSchema = mongoose.Schema({
    personalData: String,
    currentPth: [{
        location: String,
        time: Number
    }],
    car: {
        color: String,
        carNumber: String,
        model: String
    },
    avatar: String,
    updatedID: String,
    approved: Boolean
});

var driver = mongoose.model('Driver', driversSchema);
module.exports = driver;