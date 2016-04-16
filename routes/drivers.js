/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();
//var Location = require('../models/Location');
router.get('/', function(req, res, next) {

    Location.findById('57110fe99d22ed682c6e9e10', function(err, location) {
       if(err) {
            res.send("Hi from error");
       }
       else{
           res.json(location);
       }

    });
    console.log("Hello");

   // res.json({mess: "Ahmed"});
});



module.exports = router;

