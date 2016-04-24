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
    var client_id = req.header('client_id');
    var location = [
        req.header('lng'),
        req.header('lat')
    ];
    var r = req.header('r');
    User.findById(client_id, function (err, user) {
        if(err) {
            res.json({valid: false, message: "Not a valid user"});
            res.end();
        }
        else {
            Driver.find({location: { $geowithin:{$centerSphere: [
                [req.header('lng'),
                req.header('lat')],
                r/3963.2
            ]}}
            }, function(err,drivers){
               if(err){
                   res.json({msg: "hi :("});
               }
                else{
                   res.json(drivers);
               }
            });
        }

    });
});

router.get('/user', function(req, res){
    res.json({Ahmed: "Alaa"});
});
module.exports = router;