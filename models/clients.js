/**
 * Created by AhmedA on 4/12/2016.
 */

var mongoose = require('mongoose');

var HashPassWord = function(password) {
    var md5 = require('MD5');
    return md5(password);
};

var userData = {
    name: String,
    email: String,
    password: HashPassWord(word)
};

var Location = {
    lat: Number,
    lng: Number
};

var clientsSchema = mongoose.Schema({
    presonalData: {
        name: String,
        email: String,
        password: String
    },

    rides:[{
        from: {
            lat: Number,
            lng: Number
        },
        to: {
            lat: Number,
            lng: Number
        }
    }],

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