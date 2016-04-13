/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Clent api');
});

module.exports = router;