var config = {}

config.databaseURI = "localhost/mydb";

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  config.databaseURI = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

config.ipaddress    = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
config.port         = process.env.OPENSHIFT_NODEJS_PORT || 3000;


module.exports = config;
