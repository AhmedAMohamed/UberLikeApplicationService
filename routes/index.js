/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();
var Location = require('../models/Location');
router.get('/', function(req, res, next) {
    Location.findById("31241433", function (err, id) {
        return id;
    });
    res.send('Clent api');
});

module.exports = router;