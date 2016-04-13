/**
 * Created by AhmedA on 4/12/2016.
 */

var mongoose = require('mongoose');
var UserSchema = require('./users');

var HashPassWord = function(password) {
    var md5 = require('MD5');
    return md5(password);
};

var clientsSchema = mongoose.Schema({
    personalData: UserSchema,
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