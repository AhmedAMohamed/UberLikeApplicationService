/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');
var UserSchema = require('./users');
var Location = require('./Location');

var driversSchema = mongoose.Schema({
    personalData: UserSchema,
    currentPth: [{
        location: Location,
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