var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoClient = require('mongodb').MongoClient;
var MONGODB_URL = "mongodb://localhost:27017/stream_donation_playlist";

var homeRoute = require('./routes/home');
var loginRoute = require('./routes/login');
var myStreamRoute = require('./routes/myStream');
var successRoute = require('./routes/success');
var moderatedStreamsRoute = require('./routes/moderatedStreams');
var playlistsRoute = require('./routes/playlists');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
    req.mongoClient = mongoClient;
    req.MONGODB_URL = MONGODB_URL;
    next();
});

app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/myStream', myStreamRoute);
app.use('/success', successRoute);
app.use('/moderatedStreams', moderatedStreamsRoute);
app.use('/playlists', playlistsRoute);

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
        res.render('error', {
            message: err.message,
            error: err
        });
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
