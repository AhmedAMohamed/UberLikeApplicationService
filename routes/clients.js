/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var request = require('requests');

var router = express.Router();

var User = require('../models/user');
var Driver = require('../models/driver');
var Client = require('../models/client');
var Ride = require('../models/ride');

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
            Driver.find(
                {
                    currentLocation: {
                        $geoWithin:{$centerSphere: [
                            [
                                Number(location[0]),
                                Number(location[1])
                            ],
                        Number(r)
                        ]}},
                status: ""
            }, function(err,drivers){
               if(err){
                   res.json({msg: err});
               }
                else{
                   res.json(drivers);
               }
            });
        }

    });
});

router.get('/getDrivers', function(req, res){
    Driver.find({}, function (err, drivers) {
        res.json({
            d: drivers,
            ahmed: "Alaa"
        });
    });

});

router.post('/requestRide', function (req, res) {

    var clientID = req.header('client_id');
    var driverID = req.header('driver_id');
    var fromLocation = req.header('from');
    var toLocation = req.header('to');

    Client.findById(clientID, function (err, client) {
        if(err) {
            res.json({
                valid: false,
                message: "Not valid access"
            });
        }
        else {
            Driver.findById(driverID, function (err, driver) {
                if(err) {
                    res.json({
                        valid: false,
                        message: "Not valid driver"
                    });
                }
                else {
                    if(driver.status == "available") {
                        driver.status = "busy";
                        User.findById(driver.personalData, function (err, user) {
                            if(err) {
                                res.json({
                                    valid: false,
                                    message: "wrong access"
                                });
                            }
                            else {
                                request(
                                    { method: 'POST',
                                        uri: 'https://android.googleapis.com/gcm/send',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization':'key=AIzaSyCYUwtrhtXlGPuXKrgwBpOYPXkdmEaqR8Y'
                                        },
                                        body: JSON.stringify({
                                            "registration_ids" : [user.reg_id],
                                            "data" : {
                                                "from_id": clientID,
                                                "to_id": driverID,
                                                "from": fromLocation,
                                                "to": toLocation
                                            },
                                            "time_to_live": 108
                                        })
                                    }
                                    , function (error, response, body) {
                                        if(error) {
                                            res.json({
                                               valid: false,
                                                message: "Wrong data"
                                            });
                                        }
                                        else {
                                            driver.save(function (err, dr) {
                                                if(err) {
                                                    res.json({
                                                        valid: false,
                                                        message: "Wrong data"
                                                    });
                                                }
                                                else {
                                                    var ride = new Ride({
                                                        client: clientID,
                                                        driver: driverID,
                                                        status: "On way"
                                                    });
                                                    ride.save(function (err, r) {
                                                        if(err) {
                                                            res.json({
                                                                valid: false,
                                                                message: "Wrong data"
                                                            });
                                                        }
                                                        else {
                                                            res.json({
                                                                valid: true,
                                                                message: "",
                                                                ride_id: r._id
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        });
                    }
                    else {
                        res.json({
                            valid: false,
                            message: "Not available"
                        });
                    }
                }
            });
        }
    });
});
module.exports = router;