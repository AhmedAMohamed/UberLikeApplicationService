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

var clientsSchema = mongoose.schema({
    presonalData: userData,

    rides:[{
        from: Location,
        to: Location
    }],

    currentPth: [{
        location: Location,
        time: Number
    }],

    updatedID: String,
    approved: Boolean
});

var client = mongoose.model('Client', clientsSchema);
module.exports = client;