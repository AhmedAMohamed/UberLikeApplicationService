/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/cli', function(req, res, next) {
    res.send('Client api');
});

module.exports = router;