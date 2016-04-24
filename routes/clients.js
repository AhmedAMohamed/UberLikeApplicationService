/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var validator = require('../util/validation');
var router = express.Router();
var User = require('../models/user');
var Driver = require('../models/driver');

router.get('/', function(req, res) {
    res.json({message: "Not valid access", valid: false});
    res.end();
});

router.get('/getNearDrivers', function(req, res) {
    var user_id = req.header('user_id');
    var location = {
        lat: req.header('lat'),
        lng: req.header('lng')
    };
    var r = req.header('r');
    User.findById(user_id, function (err, user) {
        if(err) {
            res.json({valid: false, message: "Not a valid user"});
            res.end();
        }
        else {
            Driver.find().$where('this.location.lat < user.location.lat + '+r).exec(function(err, drivers){
                res.json(drivers);
            });
        }
    });
});

router.get('/user', function(req, res){
    res.json({Ahmed: "Alaa"});
});
module.exports = router;