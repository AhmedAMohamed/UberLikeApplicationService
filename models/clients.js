/**
 * Created by AhmedA on 4/12/2016.
 */

var mongoose = require('mongoose');
var UserSchema = require('./user');



var clientsSchema = mongoose.Schema({
    personalData: String,
    currentPth: [{
        location: {
            lat: Number,
            lng: Number
        },
        time: Number
    }],

    updatedID: String,
    approved: Boolean
});

var client = mongoose.model('Client', clientsSchema);
module.exports = client;