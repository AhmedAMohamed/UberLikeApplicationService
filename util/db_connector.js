/**
 * Created by AhmedA on 4/16/2016.
 */

var connector = function(url) {
    console.log(url);

    var mongoose = require('mongoose');
    var client = require('../models/clients');
    var driver = require('../models/driver');
    var user = require('../models/user');
    var Location = require('../models/Location');

    var connected = true;

    mongoose.connect(url, function(error) {
        if(error){
            connected = false;
            console.log("Error");
        }
        else {
            connected = true;
            console.log("DB connected");
            console.log(mongoose.modelNames());
        }
    });
}
module.exports = connector;