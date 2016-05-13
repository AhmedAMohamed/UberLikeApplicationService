/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var request = require('request');

var User = require('../models/user');
var Driver = require('../models/driver');
var Client = require('../models/client');
var Ride = require('../models/ride');

var router = express.Router();

router.post('/login', function(req, res, next) {

    var pass = req.header('password');
    var mail = req.header('email');

    var userType = req.header('type');

    User.find({
        email: mail,
        password: pass,
        type: userType
    }, function(err, users){
        if(err) {
            res.json({valid: false, message: "Not a valid access"});
        }
        else {
            if(users.length == 1) {
                if(userType == "client") {
                    Client.find({personalData: users[0]._id}, function(err, clients) {
                        if(err) {
                            res.json({valid: false, message: "Not a valid client access"});
                        }
                        if(clients.length == 1) {
                            res.json(
                                {
                                    client_id: clients[0]._id,
                                    valid: true,
                                    message: ""
                                }
                            );
                        }
                        else {
                            res.json(
                                {
                                    valid: false,
                                    message: "server error"
                                });
                        }
                    });
                }
                else if(userType == "driver" ) {
                    Driver.find({personalData: users[0]._id}, function(err, drivers){
                        if(err) {
                            res.json({valid: false, message: err});
                        }
                        if(drivers.length == 1){
                            res.json(
                                {
                                    driver_id: drivers[0]._id,
                                    valid: true,
                                    message: ""
                                }
                            );
                        }
                        else {
                            res.json(
                                {
                                    valid: false,
                                    message: "Server error driver"
                                }
                            );
                        }

                    });
                }
                else {
                    res.json({valid: false, message: "Wrong user type token"});
                }
            }
            else {
                res.json({valid: false, message: "Not even a user"});
            }
        }
    });
});

router.post('/signup', function(req, res){

    var data = {
        name: req.header('fullName'),
        email: req.header('email'),
        password: req.header('password'),
        mobile: req.header('mobile'),
        reg_id: req.header('reg_id'),
        type: req.header('type')
    };
    var user = new User(data);

    user.save(function(err, a) {
        if(err) {
            res.json({
                valid: false,
                message: "wrong data"
            });
        }
        else {
            if(req.header ("type") == 'client'){
                var data_client ={
                    personalData: a._id,
                    currentLocation: [
                         req.header("lat"),
                         req.header("lng")
                    ]
                };
                var client = new Client(data_client);
                client.save(function(err, c){
                    if(err){
                        res.json({
                            valid: false,
                            message: "error in client registration"
                        });
                    }
                    else {
                        res.json({
                            valid: true,
                            message: "",
                            client_id: c._id
                        });
                    }
                });
            }
            else if (req.header ("type") == 'driver'){
                var data_driver ={
                    personalData: a._id,
                    currentLocation: [
                        req.header("lat"),
                        req.header("lng")
                    ],
                    car:{
                        color: req.header("color"),
                        carNumber: req.header("carNumber"),
                        model: req.header("model")
                    },
                    avatar: req.header("avatar"),
                    status: "available"
                };

                var driver = new Driver(data_driver);
                driver.save(function(err, d){
                    if(err){
                        res.json({
                            valid: false,
                            message: "error in driver registration"
                        });
                    }
                    else{
                        res.json({
                            user_id: d._id,
                            valid: true,
                            message: ""
                        });
                    }
                });
            }
            else {
                res.json({
                    valid: false,
                    message: "Not valid operation"
                });
            }
        }
    });
});

router.put('/updateUserLocation', function(req, res){
    var userType = req.header("type");
    if(userType == "driver") {
        var driverID = req.header("driver_id");
        Driver.findOne({_id: driverID}, function (err, driver) {
            if(err) {
                res.json({
                    valid: false,
                    message: "Not found"
                });
            }
            else {
                driver.currentLocation = [
                    req.header("lat"),
                    req.header("lng")
                ];
                driver.save(function (err, d) {
                    if(err) {
                        res.json({
                            valid: false,
                            message: "not valid location"
                        });
                    }
                   else {
                        if (d.status == "available"){
                            // use GCM clients within range
                            Client.find({currentLocation : {$geoWithin: {$centerSphere:[
                                    [Number(Location[0]), Number(Location[1])],
                                    Number(r)
                                ]}}
                                },
                                'reg_id', function(err, clients){
                                    //loop on clients
                                    var clientsList =[];
                                    for( client in clients){
                                        clientsList.push(client);
                                    }
                                    request(
                                        {
                                            method: 'POST',
                                            uri: 'https://android.googleapis.com/gcm/send',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'key=Your API Key'
                                            },
                                            body: JSON.stringify({
                                                    "registration_ids": clientsList,
                                                    "data": {
                                                        "location": d.currentLocation
                                                    }
                                                }
                                            )
                                        }
                                        , function (error, response, body) {
                                            if(error){
                                                res.json({
                                                    valid: false,
                                                    message: "ERROR"
                                                });
                                            }
                                            else {
                                                res.json({
                                                    valid: true,
                                                    driverId: d._id,
                                                    message: ""
                                                });
                                            }

                                        }
                                    )

                                }
                            )
                        }
                        else if (d.status == "busy"){
                            // use GCM client on ride
                            Ride.find({driver: d._id}, function(err, rides) {
                                if(err) {
                                    res.json({valid: false, message: "driver has no ride"});
                                }
                                if(rides.length == 1) {
                                    request(
                                        {
                                            method: 'POST',
                                            uri: 'https://android.googleapis.com/gcm/send',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'key=Your API Key'
                                            },
                                            body: JSON.stringify({
                                                    "registration_ids": rides.client,
                                                    "data": {
                                                        "location": d.currentLocation
                                                    }
                                                }
                                            )
                                        }
                                        , function (error, response, body) {
                                            if(error){
                                                res.json({
                                                    valid: false,
                                                    message: "ERROR"
                                                });
                                            }
                                            else {
                                                res.json({
                                                    valid: true,
                                                    driverId: d._id,
                                                    message: ""
                                                });
                                            }

                                        }
                                    )
                                }
                                else {
                                    res.json(
                                        {
                                            valid: false,
                                            message: "error"
                                        });
                                }
                            });
                        }
                        else if (d. status == "outService"){
                            
                        }
                        res.json({
                            valid: true,
                            driverId: d._id,
                            message: ""
                        });
                    }
                });
            }
        });
    }
    else if(userType == "client") {
        var clientID = req.header('client_id');
        Client.findOne({_id: clientID}, function (err, client) {
            if(err) {
                res.json({
                    valid: false,
                    message: "Not valid access"
                });
            }
            else {
                client.currentLocation = [
                    req.header('lat'),
                    req.header('lng')
                ];
                client.save(function (err, c) {
                    if(err) {
                        res.json({
                            valid: false,
                            message: "Can not update the location"
                        });
                    }
                    else {
                        res.json({
                            valid: true,
                            client_id: c._id,
                            message: ""
                        });
                    }
                });
            }
        });
    }
    else {
        res.json({
            valid: false,
            message: "wrong access"
        });
    }
});

router.get('/checkGCM', function (req, res) {
    request({
            "uri": "https://gcm-http.googleapis.com/gcm/send",
            "method": "POST",
            "headers": { //We can define headers too
                'Content-Type': 'application/json',
                'Authorization': 'key=AIzaSyBr6_kLRRLByjUJPE1kH83fmGhN5uA0KjY'
            },
            "body": JSON.stringify({
                "registration_ids": ["eXDwSUG7ZQ8:APA91bHY_VKzBLBAr28SmP5gjtHoKS--9xsg_cVHBcwDFhExDirEP81AxUMkmL9p9hrSIF2t_O4LOukEvOfI9AFkKVLjGSllkewXpH-MgxHTexyly9JCbZGXbjineAnNKeg0Xw36PIpy"],
                "collapse_key ": "demo",
                "data": {
                    "title": "updateLocation",
                    "driver_location_data": {
                        "driver_id": "sfdvsdlfgldfsgjljdskflgksdf",
                        "driver_data": {
                            "ay": "hariii"
                        }
                    },
                    "driver_notification": {
                        "data": "ahmed alaa"
                    }
                }
            })
        }
        , function (error, response, body) {
            console.log(error);
            if(error) {
                res.json({
                    err: error,
                    res: response
                });
            }
            else {
                res.json({
                    Ahmed: "Alla",
                    res: response,
                    b: body
                });
            }
        }
    );
});
module.exports = router;