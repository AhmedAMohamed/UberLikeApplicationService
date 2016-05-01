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
        type: [Number],
        index: '2d'
    },
    
});

var client = mongoose.model('Client', clientsSchema);
module.exports = client;