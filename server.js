#!/bin/env node

//*********************************************
// MODULE DEPENDENCIES
// ********************************************

var express     = require('express');
var app         = module.exports = express();
var request     = require('request');
var mongojs     = require('mongojs');
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
    app.use(express.json());
    app.use(express.cookieParser());
    app.use(express.session({ 
        store: new MongoStore({
            url: 'mongodb://localhost/mydb'
        }),
        secret: "fjdaksfjaklfjasklfadasdasdsadafdsfragrfgafdnvakl" }
    ));
});

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

// default to a 'localhost' configuration:
var connection_string = 'mydb';
var db = mongojs(connection_string, ['books']);
var books = db.collection('books');
//googlebookapi url constant
var GBOOKAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
var cachedBook = {};

// ROOT logic
app.get('/', function(req, res){
    db.books.find().sort({$natural: -1}, function(err, books) {
        res.render('index.jade', {"books": books});
    });
});

// Query google book api for a specific book and cache the returned info
app.post('/queryBook', function(req, res){
        request(GBOOKAPI + req.body.isbn, function (err, response, body) {
            googleBookRes = JSON.parse(body);

            if (!err && response.statusCode == 200) {
                if (0 === googleBookRes.totalItems) {
                    res.status(500).send("book not within googles shelfs");
                    return;
                }

                googleBookRes = googleBookRes.items[0].volumeInfo;

                if(!googleBookRes.imageLinks) {
                    googleBookRes.imageLinks = {
                        smallThumbnail : 'img/default.jpg',
                        thumbnail: 'img/default.jpg'
                    };
                }

                if(!googleBookRes.description) {
                    googleBookRes.description = "Sorry, no description available";
                }

                cachedBook = {
                    title: googleBookRes.title,
                    author: googleBookRes.authors[0],
                    coverLink: googleBookRes.imageLinks,
                    date: new Date(req.body.date).toDateString(),
                    type: req.body.book_type,
                    description :  googleBookRes.description,
                    rating: req.body.rating,
                    lang: req.body.book_lang
                };
                res.status(200).send(cachedBook);
            } else {
                res.status(500).send(err);
            }
        });
});

// Add cached book to collection
app.post('/addBook', function(req, res) {
    cachedBook.coverLink = cachedBook.coverLink.smallThumbnail;
    try {
        db.books.save(cachedBook, function(err, saved) {
            if (!err) {
                res.status(200).send(cachedBook);
                console.log("Book saved");
            } else {
                res.status(500).send('issues while saving');
                console.log("Issue while saving");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('issues while saving');
    }
});


app.get('/books', function(req, res){
    db.books.find(function(err, allBooks) {
        console.log(allBooks);
        res.send(allBooks);
    });
});

// Helpers

// Routes

app.listen(app.settings.port, app.settings.ipaddress, function() {
    console.log('%s: This piece of shit is rolling... %s:%d ...',
    Date(Date.now() ), app.settings.ipaddress, app.settings.port);
});
