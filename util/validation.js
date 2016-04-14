/**
 * Created by AhmedA on 4/14/2016.
 */
var User = require('./models/user');

var userChecker = function($id) {
    User.find({ _id: $id }, function(err, users){
        if(err)
            return 0;
        users.map();
    });
};