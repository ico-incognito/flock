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


var index = require('./routes/index');
var users = require('./routes/users');
var flock = require('./routes/flock');

var app = express();
var events = new EventEmitter();





flock.appId = '2e1325bb-c171-40c2-8ae0-ef3b73124d9d';
flock.appSecret = '597911b9-ea5b-4d2a-9d01-bf78e20a1a42';

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
//app.use(flock.events.tokenVerifier);


app.post('/form', function(req, res){
    console.log('you posted: First Name: ');
});
    app.use('/', index);
    app.use('/users', users);
    app.use('/flock', flock);

events.tokenVerifier = function (req, res, next) {
    // if res.locals.eventTokenPayload exists, we've already run the
    // token verifier, no need to run it again
    if (!res.locals.eventTokenPayload) {
        var token = req.get('x-flock-event-token') || req.query.flockEventToken;
        if (token) {
            // if userId is given, include it for verification
            var userId = null;
            if (req.is('application/json') && req.body) {
                userId = req.body.userId;
            } else if (req.query.flockEvent) {
                try {
                    var event = JSON.parse(req.query.flockEvent);
                    userId = event.userId;
                } catch (e) {
                    //console.warn('Couldn't parse flockEvent query param');
                }
            }
            var payload = events.verifyToken(token, userId);
            if (!payload) {
                console.warn('Invalid event token', token);
                res.sendStatus(403);
                return;
            }
            res.locals.eventTokenPayload = payload;
        }
    }
    next();
};


events.listener = express.Router();
events.listener.use(require('body-parser').json());
events.listener.use(events.tokenVerifier);
events.responseTimeout = 60 * 1000;
events.listener.use(function (req, res, next) {
    console.log('received request: ', req.method, req.url, req.headers);
    console.log('received event: %j', req.body);
    var event = req.body;
    var responded = false;
    var timeoutID = null;
    events.listeners(event.name).forEach(function (listener) {
        try {
            listener(event, function (error, body) {
                if (responded) {
                    console.warn('(%s) Only one listener can respond to an event', event.name);
                    return;
                }
                responded = true;
                if (timeoutID) {
                    clearTimeout(timeoutID);
                }
                if (error) {
                    var statusCode = error.statusCode || 400;
                    res.status(statusCode).send({ error: error.name,
                        description: error.message });
                } else if (body && typeof body === 'object' || typeof body === 'string') {
                    res.send(body);
                } else {
                    res.send({});
                }
            });
        } catch (e) {
            console.warn('(%s) Got an error in event listener', event.name, e);
        }
    });
    if (!responded) {
        timeoutID = setTimeout(function () {
            res.send({});
        }, events.responseTimeout);
    }
});


app.post('/events', events.listener);

events.on('client.slashCommand', function (event, callback) {
    // handle slash command event here
console.log("Received");
    // invoke the callback to send a response to the event
    callback(null, { text: 'Received your command' });
});


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
