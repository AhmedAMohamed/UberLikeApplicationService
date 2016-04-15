/**
 * Created by AhmedA on 4/12/2016.
 */

var mongoose = require('mongoose');
var UserSchema = require('./user');
var loactionSchema = require('./Location');


var clientsSchema = mongoose.Schema({
    personalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentPth: [{
        location:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
        time: Number
    }],

    updatedID: String,
    approved: Boolean
});

var client = mongoose.model('Client', clientsSchema);
module.exports = client;