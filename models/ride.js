/**
 * Created by AhmedA on 5/1/2016.
 */

var mongoose = require('mongoose');

var rideSchema = new mongoose.Schema({

    client: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Client'
    },

    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },

    startTime: Number,

    endTime: Number,

    status: String,

    locations: [
        {
            location:{
                type: [Number],
                index: '2d'
            },
            time: Number
        }
    ]
});

var ride = mongoose.model('Ride', rideSchema);
module.exports = ride;