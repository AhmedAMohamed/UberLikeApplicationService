var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var drivers = require('./routes/drivers');
var clients = require('./routes/clients');

var client = require('./models/clients');
var driver = require('./models/driver');
var user = require('./models/user');
var Location = require('./models/Location')
var app = express();

var connected = true;
var url = 'mongodb://localhost/uber2';
db = mongoose.connect(url, function(error) {
    if(error){
        connected = false;
        console.log("Error");
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            console.log("Can not connect to the DB");
            next(err);
        });
    }
    else {
        connected = true;
        console.log("DB connected");
        console.log(mongoose.modelNames());
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(connected) {
    app.use('/', routes, cors());
    app.use('/api/user', users, cors());
    app.use('/api/driver', drivers, cors());
    app.use('/api/client', clients,cors());
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({messaage: "Ahmed "});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
