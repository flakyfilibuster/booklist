#!/bin/env node

// ============================================
// MODULE DEPENDENCIES
// ============================================
var express     = require('express');
var app         = module.exports = express();
var request     = require('request');
var passport    = require('passport');
var flash       = require('connect-flash');
var config      = require('./config/config');

// ============================================
// APP CONFIGURATION - DEFAULT
// ============================================
app.configure(function(){
    app.set('ipaddress', config.ipaddress);
    app.set('port', config.port);
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: config.secret }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    require('./config/passport')(passport);
});


// ============================================
// APP CONFIGURATION - DEVELOPMENT
// ============================================
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    process.env.NODE_ENV = app.settings.env;
}


// ============================================
// APP CONFIGURATION - TEST
// ============================================
app.configure('test', function(){
    app.set('port', 3001);
});


// ============================================
// HELPERS
// ============================================
require('./apps/helpers')(app);


// ============================================
// ROUTES
// ============================================
require('./apps/read/routes')(app);
require('./apps/query/routes')(app, request);
require('./apps/authentication/routes')(app, passport);


// ============================================
// FIRE IT UP!
// ============================================
var server = app.listen(app.settings.port, app.settings.ipaddress, function() {
    console.log('%s || IP: %s || PORT: %d || ENV:',
    Date(Date.now() ), app.settings.ipaddress, app.settings.port, app.settings.env.toUpperCase());
});
