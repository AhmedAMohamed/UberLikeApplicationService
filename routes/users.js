/**
 * Created by AhmedA on 4/11/2016.
 */
var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/login', function(req, res, next) {

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
    var user = User(data);
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