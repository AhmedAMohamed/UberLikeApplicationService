/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var request = require('request');

var User = require('../models/user');
var Driver = require('../models/driver');
var Client = require('../models/client');

var router = express.Router();

router.post('/login', function(req, res, next) {

    var pass = req.header('password');
    var mail = req.header('email');

    var userType = "client";

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

                        request({
                                "uri": "https://gcm-http.googleapis.com/gcm/send",
                                "method": "POST",
                                "headers": { //We can define headers too
                                    'Content-Type': 'application/json',
                                    'Authorization': 'key=AIzaSyBr6_kLRRLByjUJPE1kH83fmGhN5uA0KjY'
                                },
                                "body": JSON.stringify({
                                    "registration_ids": [
                                        "feblnXPx-Ls:APA91bFvP9NYDwEV548o-bpq2mtiL-0OQEulyG5HuNj464qRgg7MkOqddLnQgT85ROzVZ5vdS4oVkyP_Fg76_gislohrXja2ZFPx2sKp9oNtmsPv8TDOLLtfQeC1JhDu1QX_ijvnr3zo"
                                        ,a.reg_id
                                        ,"cC2-tA4yFug:APA91bGGMYAyjhq36IPYwPhIj8HvXOTORqaAPgP39U_LojmPfT7SffHbORQYRyDvsEKMtBxbi96c__EFqlJYx8IRrT_-Dy1osXRZ-cTcJnQsVNmYUeiS2bMWS4tdryzBRXWXA4ScLWNh",
                                        "ev1TSxC0NQ0:APA91bHS4NE_XBi3-VmptuIKzcr2zTYsA8cCXVVPSnuP0t-RJVMftYqv3tZo7hNBZI-rfwRAZ3ixCUMS49Nm_pWHaQX_bgFY_lf9sEEDh2hNnY2Ftvelu1dtZLjuxCW2lk0Dv2_bac_r",//"efs1UslXmTE:APA91bGvyzGDS8rYjrMb4kq3EwCkTWWA4iwkcv1V8W0RNvHm6qulR_mmI1G6varQAlAT5CdIwHGAHDw1IE1O-Gpmi0btdHRxDY4ikCJ4AucP-Y9ygbePjdyRiqPfV5K62q6baavPNEHg",
                                        "cgiA6RcWJKo:APA91bFToaHL35sgQrtC3j0NkOhfJmhyAWede5xOOHBC6uVsvJXt1m6FGGAhCyMGMnC3MZjiaBHVoJPm9oyX8HjxrdYoiCtRAwH3kNCvPERfTAArTyS3RNIrxAaDPGAIXS2QpgJq4ef-"],
                                    "notification": {
                                        "title": "ahmed",
                                        "icon": "alal",
                                        "body": "HHHHHHHHHHHHHHHH"
                                    }
                                })
                            }
                            , function (error, response, body) {
                                console.log(error);
                                if(error) {
                                    res.json({
                                        Err: "AAAAAAA"
                                    });
                                }
                                else {
                                    res.json({
                                        Ahmed: "Alla"
                                    });
                                }
                            }
                        );
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

router.get('/checkGCM', function (req, res) {
    request({
            "uri": "https://gcm-http.googleapis.com/gcm/send",
            "method": "POST",
            "headers": { //We can define headers too
                'Content-Type': 'application/json',
                'Authorization': 'key=AIzaSyBr6_kLRRLByjUJPE1kH83fmGhN5uA0KjY'
            },
            "body": JSON.stringify({
                "registration_ids": ["fuOZewt6aPs:APA91bEsuX4HlloxWKM5eZ8tefj_26cjvL9ouD7n-2ZJLiXEejKgXhCCiStvPwQEqM8-rxtT4aQQBF2vRwVTFUGV69Kkyh4y5ah4uvbul9vNGvosHKzxgTlhXZDv9K6TH1X7JVq2InPS"],
                "data": {
                    "title": "",
                    "icon": "",
                    "body": ""
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