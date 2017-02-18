var express = require('express');
var router = express.Router();
var flock = require('flockos');
var EventEmitter = require('events');
var jwt = require('jsonwebtoken');
var request = require('request');
var util = require('util');
var qs = require('querystring');
var http= require('http');

flock.appId = '2e1325bb-c171-40c2-8ae0-ef3b73124d9d';
flock.appSecret = '597911b9-ea5b-4d2a-9d01-bf78e20a1a42';
var events = new EventEmitter();

events.listener = express.Router();
events.listener.use(require('body-parser').json());

/* GET home page. */


 router.post('/', events.listener);

    events.on('client.slashCommand', function (event, callback) {
        // handle slash command event here
        // invoke the callback to send a response to the event
        callback(null, { text: 'Received your command' });
    });


module.exports = router;
