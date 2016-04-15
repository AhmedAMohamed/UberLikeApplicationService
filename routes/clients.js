/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();
var Location = require('../models/Location');
var counter = 0;
router.get('/', function(req, res) {
    var location = new Location({
        lat: counter,
        lng: counter,
        updatedID: "",
        approved: false
    });
    counter++;
    location.save();
    res.send("Ahmed");
});

module.exports = router;