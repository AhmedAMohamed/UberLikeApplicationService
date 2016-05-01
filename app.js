var express = require('express');
var cors = require('cors');

var routes = require('./routes/index');
var users = require('./routes/users');
var drivers = require('./routes/drivers');
var clients = require('./routes/clients');


var app = express();
var db = require('./util/db_connector');

db('mongodb://AhmedAMohamed:Gehad123!@ds021761.mlab.com:21761/uberapp', function(connected){
    if(connected) {
        console.log("Ahmed Rocks");
        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use('/', routes, cors());
        app.use('/api/user', users, cors());
        app.use('/api/driver', drivers, cors());
        app.use('/api/client', clients,cors());

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
    else {
        console.log("Bad bad");
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
});

// error handlers
/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({messaage: "Ahmed "});
  });
}
*/
module.exports = app;