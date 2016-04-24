/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var User = require('../models/user');
var Driver = require('../models/driver');
var Client = require('../models/clients');

var router = express.Router();

router.post('/login', function(req, res, next) {

    var type = req.header("type");
    if(type == "driver") {
        User.find({email: req.header('email'), password: req.header('password')}, function (err, users) {
            if(err) {
                res.json({valid: false, message: "Not found"});
                res.end();
            }
            else {
                if(users.length == 1) {
                    Driver.find({personalData: users[0]._id}, function (err, drivers) {
                        if(drivers.length == 1) {

                        }
                    });
                }
                else {
                    res.json({valid: false, message: "Not found"});
                    res.end();
                }
            }
        });
    }
    User.find({email: req.header('email'),
               password: req.header('password')}, function(err, auth){
        if(err) res.json({
            valid:false,
            message: "Not Found"
            });
        else {
            res.json({
                user_id: auth[0]._id,
                valid: true,
                message: ""
            });
        }
    })
});

router.post('/signup', function(req, res){
    console.log(req.header("fullName"));
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
                    else{
                        res.json({
                            user_id: c._id,
                            valid: true,
                            message: ""
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
        }
    });



});


module.exports = router;