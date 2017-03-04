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

var botToken='cbf86380-6f95-4d50-b168-bb79f0acc770';
var botId='u:Bkkkeezsrowkree4';

var app= express();
app.use(flock.events.tokenVerifier);

app.post('/events',flock.events.listener);
flock.events.on('app.install', function(event, callback){
    callback();
});

flock.events.on('client.slashCommand', function (event, callback) {
    // handle slash command event here
    // invoke the callback to send a response to the event
    var name=event.userName;
    var jobj="hahaha";
    console.log(event.userName);
    request({
        method: 'GET',
        url: 'http://5d6ff8d2.ngrok.io/account?name='+name,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var object = JSON.parse(body);
            console.dir(object, {depth: null, colors: true})
            console.log(object.account.itemAccountId);
            console.log(object.account.accountName);
            jobj="ID: "+object.account.itemAccountId+" Name: "+object.account.accountName+" Transaction ID: "+object.viewKey.transactionId+" Amount: "+object.amount.amount+" "+object.amount.currencyCode;
            callback(null, { text: jobj });
        }
    });
});
    flock.events.on('chat.receiveMessage', function(event, callback) {
        //callback(null,
        console.log(event.message.text);
        if(event.message.text=="New Task" && event.message.from=="u:kpvueleeppirddgv")
        {
            flock.chat.sendMessage(botToken,{
                to: event.userId,
                text: 'Description And Urgency?'
            });
        }else if(event.message.text.length<8 && event.message.from=="u:kpvueleeppirddgv" && event.message.text!="Yes")
        {
            flock.chat.sendMessage(botToken,{
                to: event.userId,
                text: 'Sorry I did not understand'
            });
        }else if(event.message.from=="u:kpvueleeppirddgv")
        {
            var str=event.message.text+". Mention your worst, best and optimal time required to complete the job";


            flock.chat.sendMessage(botToken,{
                to: "u:8t84y8ey4ky8a8t4",
                text: str
            });
            flock.chat.sendMessage(botToken,{
                to: "u:n6f1ww9o4cwf664f",
                text: str
            });

        }

        if(event.message.from!="u:kpvueleeppirddgv"&& event.message.text.substring(0,5)=="Worst")
        {
            flock.chat.sendMessage(botToken,{
                to: event.message.from,
                text: 'Thanks for your submission'
            });
            var str1= event.message.from+" has replied "+event.message.text;
            flock.chat.sendMessage(botToken,{
                to: "u:kpvueleeppirddgv",
                text: str1
            });
        }
        else if(event.message.from!="u:kpvueleeppirddgv")
        {
            flock.chat.sendMessage(botToken,{
                to: event.message.from,
                text: 'Sorry I cannot help you'
            });
        }


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
