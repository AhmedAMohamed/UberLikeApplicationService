/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var validator = require('../util/validation');
var router = express.Router();
var User = require('../models/user');
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

var val = validator[1];
router.get('/user', function(req, res){
    res.json({Ahmed: "Alaa"});
});
module.exports = router;