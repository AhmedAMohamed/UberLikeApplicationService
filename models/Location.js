/**
 * Created by AhmedA on 4/13/2016.
 */

var mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({
    location: {
        type:
        {
            lat: Number,
            lng: Number
        },
        unique: true
    }
});

var location = mongoose.model('Location', LocationSchema);
module.exports = location;
