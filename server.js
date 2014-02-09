#!/bin/env node

//*********************************************
// MODULE DEPENDENCIES
// ********************************************

var express     = require('express');
var app         = module.exports = express();
var request     = require('request');
var MongoStore  = require('connect-mongo')(express);

//*********************************************
// APP CONFIGURATION
// ********************************************

app.configure(function(){
    app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
    app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
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
            url: 'mongodb://localhost/mydb'
        }),
        secret: "fjdaksfjaklfjasklfadasdasdsadafdsfragrfgafdnvakl" }
    ));
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    process.env.NODE_ENV = app.settings.env;
}

// test configuration
app.configure('test', function(){
    app.set('port', 3001);
});

// switch when run on openshift cloud
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}


// Routes
require('./apps/read/routes')(app);
require('./apps/query/routes')(app, request);

var server = app.listen(app.settings.port, app.settings.ipaddress, function() {
    console.log('%s || IP: %s || PORT: %d || ENV:',
    Date(Date.now() ), app.settings.ipaddress, app.settings.port, app.settings.env.toUpperCase());
});
