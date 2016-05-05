/**
 * Created by AhmedA on 4/13/2016.
 */
var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
    name: {type: String, unique: false, trim: true},
    email: {type: String, unique: true, trim: true},
    password: {type: String, unique: false},
    mobile: String,
    type: String,
    reg_id: String,

    rides: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    }
});

var users = mongoose.model('User', UserSchema);
module.exports = users;