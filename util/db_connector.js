/**
 * Created by AhmedA on 4/16/2016.
 */

var connector = function(url, callback) {
    console.log(url);

    var mongoose = require('mongoose');
    var client = require('../models/client');
    var driver = require('../models/driver');
    var user = require('../models/user');
    var ride = require('../models/ride');

    mongoose.connect(url, function(error) {
        if(error){
            console.log("Error");
            callback(false);
        }
        else {
            callback(true);
            console.log("DB connected");
            console.log(mongoose.modelNames());
        }

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            // we're connected!
            console.log("HAHAAHAHAHHAHAHAH  AA");
        });

    });

}
module.exports = connector;