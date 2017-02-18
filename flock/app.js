var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var EventEmitter = require('events');
var jwt = require('jsonwebtoken');
var request = require('request');
var util = require('util');
var qs = require('querystring');
var http= require('http');

var flock = require('flockos');

var index = require('./routes/index');
var users = require('./routes/users');




flock.appId = '2e1325bb-c171-40c2-8ae0-ef3b73124d9d';
flock.appSecret = '597911b9-ea5b-4d2a-9d01-bf78e20a1a42';

var app= express();
app.use(flock.events.tokenVerifier);

app.post('/events',flock.events.listener);
flock.events.on('app.install', function(event, callback){
    callback();
});
flock.events.on('app.install', function(event, callback){
    callback();
});
flock.events.on('client.slashCommand', function (event, callback) {
    // handle slash command event here
    // invoke the callback to send a response to the event
    callback(null, { text: 'Received your command' });
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
