#!/bin/env node

// ============================================
// MODULE DEPENDENCIES
// ============================================
var express     = require('express');
var app         = module.exports = express();
var request     = require('request');
var MongoStore  = require('connect-mongo')(express);
var passport    = require('passport');
var flash       = require('connect-flash');


// ============================================
// APP CONFIGURATION - DEFAULT
// ============================================
var port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || 8080;
var ipAdd = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost';
//app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ 
    store: new MongoStore({
        url: 'localhost/mydb'
    }),
    secret: "fjdaksfjaklfjasklfadasda"}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


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
// OPENSHIFT CONFIGURATION
// ============================================
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}


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
//var server = app.listen(app.settings.port, app.settings.ipaddress, function() {
    //console.log('%s || IP: %s || PORT: %d || ENV:',
    //Date(Date.now() ), app.settings.ipaddress, app.settings.port, app.settings.env.toUpperCase());
//});
var server = app.listen(port, ipAdd, function() {
    //console.log('%s || IP: %s || PORT: %d || ENV:',
    //Date(Date.now() ), app.settings.ipaddress, app.settings.port, app.settings.env.toUpperCase());
});
