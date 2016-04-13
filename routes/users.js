/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Client api');
});

router.get('/ahmed', function(req, res, next){
    console.log("Here");
});


module.exports = router;