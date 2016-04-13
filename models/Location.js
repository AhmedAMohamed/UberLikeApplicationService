/**
 * Created by AhmedA on 4/13/2016.
 */

var mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({
    lat: Number,
    lng: Number,

    updatedID: String,
    approved: Boolean
});

var location = mongoose.model('Location', LocationSchema);
module.exports = location;
