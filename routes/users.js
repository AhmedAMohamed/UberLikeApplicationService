/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    res.send('Ahmed Alaa ');
});

router.get('/signup', function(req, res, next){

});


module.exports = router;