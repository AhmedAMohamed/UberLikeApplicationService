/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var User = require('../models/user');
var Driver = require('../models/driver');

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
});

router.post('/signup', function(req, res){
    console.log(req.header("fullName"));
    var data = {
        name: req.header('fullName'),
        email: req.header('email'),
        password: req.header('password'),
        mobile: req.header('mobile'),
        type: 'type'
    };
    var user = new User(data);
    user.save(function(err, a) {
        if(err) {
            res.json({
                valid: false,
                message: "Error"
            });
        }
        else {
            res.json({
                user_id: a._id,
                valid: true,
                message: ""
            });
        }
    });
});


module.exports = router;