var config = require("./config");

var databaseURI = config.databaseURI;
    mongojs     = require("mongojs");
    database    = mongojs.connect(databaseURI);

module.exports = database;
