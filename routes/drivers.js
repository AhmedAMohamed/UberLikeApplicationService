/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();

var Driver = require('../models/driver');
var User = require('../models/user');

router.put('/updateDriverStatus', function(req, res) {
    var driverId = req.header('driver_id');
    var status = req.header('status');

    Driver.findById(driverId, function (err, driver) {
        if(err) {
            res.json({
                valid: false,
                message: "not found"
            });
        }
        else {
            driver.status = status;
            driver.save(function (err, d) {
                if(err) {
                    res.json({
                        valid: false,
                        message: "could not change status"
                    });
                }
                else {
                    res.json({
                        valid: true,
                        message: "",
                        driver_id: d._id
                    });
                }
            });
        }
    });
});

router.get('/getDriverData', function (req, res, next) {

    var driverId = req.header('driver_id');
    Driver.findById(driverId, function (err, driver) {
        if(err) {
            res.json({
                valid: false,
                message: "not valid ID"
            });
        }
        else {
            User.findById(driver.personalData, function (err, user) {
                if(err) {
                    res.json({
                        valid: false,
                        message: "wrong operation"
                    });
                }
                else {
                    res.json({
                        valid: true,
                        user_data: user,
                        driver_data: driver,
                        message: ""
                    });
                }
            });
        }
    });
});
module.exports = router;