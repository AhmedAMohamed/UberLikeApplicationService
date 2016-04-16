/**
 * Created by AhmedA on 4/14/2016.
 */
var User = require('./models/user');

var userChecker = function($id) {
    User.findById($id, function(err, user){
        if(err)
            return 0;
        return user;
    });
};