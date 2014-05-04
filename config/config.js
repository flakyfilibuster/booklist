var config = {};

config.databaseURI = "localhost/mydb";

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  config.databaseURI = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

config.ipaddress        = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
config.port             = process.env.OPENSHIFT_NODEJS_PORT || 3000;
config.secret           = process.env.OPENSHIFT_SECRET_TOKEN || "nvsudialb3242342vianmvo9hibakeykuabvsykadvnoifk907498732avikfbdv7489236432403afdkuav";
config.googlebooksapi   = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

module.exports = config;
