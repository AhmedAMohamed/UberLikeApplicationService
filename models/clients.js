/**
 * Created by AhmedA on 4/12/2016.
 */

var mongoose = require('mongoose');
var UserSchema = require('./user');

var clientsSchema = mongoose.Schema({
    personalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentLocation: { // last updated location
        lat: Number,
        lng: Number
    },
    currentPath: [{
        location:{
            lat: Number,
            lng: Number
        },
        time: Number
    }]
});

var client = mongoose.model('Client', clientsSchema);
module.exports = client;