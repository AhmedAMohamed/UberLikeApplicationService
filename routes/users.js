/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var gcm = require('android-gcm');

var User = require('../models/user');
var Driver = require('../models/driver');
var Client = require('../models/client');

var router = express.Router();

router.post('/login', function(req, res, next) {
    var userType = req.header('type');
    var pass = req.header('password');
    var mail = req.header('email');
    var mob = req.header('mobile');
    User.find({
        email: mail,
        password: pass,
        mobile: mob,
        type: userType
    }, function(err, users){
        if(err) {
            res.json({valid: false, message: "Not a valid access"});
        }
        else {
            if(users.length == 1) {
                if(userType == "client") {
                    Client.find({personalData: users[0]._id}, function(err, clinets) {
                        if(err) {
                            res.json({valid: false, message: "Not a valid client access"});
                        }
                        if(clinets.length == 1) {
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
                                    clients: clinets,
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
                                    ussers: users,
                                    drivers: drivers,
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
                            user_id: c._id,
                            valid: true,
                            message: "",
                            re: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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
                    avatar: req.header("avatar")
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
                    res.json({
                        valid: true,
                        driverId: d._id,
                        message: ""
                    });
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

module.exports = router;