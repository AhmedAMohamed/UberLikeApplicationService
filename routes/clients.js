/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var request = require('request');

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
                status: "available"
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
            Ahmed: "Alla Mohamed el said"
        });
    });

});

router.post('/requestRide', function (req, res) {

    var clientID = req.header('client_id');
    var driverID = req.header('driver_id');

    var fromLocationLat = req.header('from_lat');
    var fromLocationLng = req.header('from_lng');

    var toLocationLat = req.header('to_lat');
    var toLocationLng = req.header('to_lng');

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
                        User.findById(driver.personalData, function (err, driverUser) {
                            if(err) {
                                res.json({
                                    valid: false,
                                    message: "wrong access"
                                });
                            }
                            else {
                                var rideData = {
                                    client: clientID,
                                    driver: driverID,
                                    from: [
                                        fromLocationLat,
                                        fromLocationLng
                                    ],
                                    to: [
                                        toLocationLat,
                                        toLocationLng
                                    ],
                                    status: "on way"
                                }
                                var ride = new Ride(rideData);
                                ride.save(function (err, r) {
                                    if(err) {
                                        res.json({
                                                valid: false,
                                                message: "Wrong operation"
                                        });
                                    }
                                    else {
                                        driver.currentRide = r._id;
                                        driver.status = "busy";
                                        driver.save(function (err, d) {
                                            if(err) {
                                                res.json({
                                                    valid: false,
                                                    message: "wrong operation"
                                                });
                                            }
                                            else {
                                                request({
                                                        "uri": "https://gcm-http.googleapis.com/gcm/send",
                                                        "method": "POST",
                                                        "headers": { //We can define headers too
                                                            'Content-Type': 'application/json',
                                                            'Authorization': 'key=AIzaSyBr6_kLRRLByjUJPE1kH83fmGhN5uA0KjY'
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "registration_ids": [d.reg_id],
                                                                "data": {
                                                                    "to": "driver",
                                                                    "from_lat": r.from[0],
                                                                    "from_lng": r.from[1],
                                                                    "to_lat": r.to[0],
                                                                    "to_lng": r.to[1]
                                                                },
                                                                "time_to_live": 108
                                                            }
                                                        )
                                                    }
                                                    , function (error, response, body) {
                                                        if(error) {
                                                            res.json({
                                                                valid: false,
                                                                status: "notify",
                                                                message: "Ride confirmed but the driver did not notified yet"
                                                            });
                                                        }
                                                        else {
                                                            res.json({
                                                                valid: true,
                                                                message: "",
                                                                ride_id: r._id,
                                                                client_id: clientID
                                                            });
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    }
                                });

                                /*
                                request(
                                    {
                                        "uri": "https://gcm-http.googleapis.com/gcm/send",
                                        "method": "POST",
                                        "headers": { //We can define headers too
                                            'Content-Type': 'application/json',
                                            'Authorization': 'key=AIzaSyBr6_kLRRLByjUJPE1kH83fmGhN5uA0KjY'
                                        },
                                        body: JSON.stringify({
                                            "registration_ids" : [user.reg_id],
                                            "data" : {
                                                "from_id": clientID,
                                                "to_id": driverID,
                                                "from_lat": fromLocationLat,
                                                "from_lng": fromLocationLng,
                                                "to_lat": toLocationLat,
                                                "to_lng": toLocationLng
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
                                */
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

router.get('/getRidesHistory', function (req, res) {

    var clientId = req.header('client_id');
    if(clientId) {
        Client.findById(clientId, function(err, client){
            if(err) {
                res.json({
                    valid: false,
                    message: "Not valid client access"
                });
            }
            else {
                User.findOne({_id: client.personalData}, 'rides', function (err, user) {
                    if(err) {
                        res.json({
                            valid: false,
                            message: "Unexpected error"
                        });
                    }
                    else {
                        Ride.find({
                            _id: {
                                $in: user.rides
                            }
                        }, function (err, rides) {
                            if(err) {
                                res.json({
                                    valid: false,
                                    message: "Not valid client access"
                                });
                            }
                            else {
                                res.json({
                                    valid: true,
                                    client_id: clientId,
                                    message: "",
                                    data: rides
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.json({
            valid: false,
            message: "Not valid ID"
        });
    }
});

module.exports = router;