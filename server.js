#!/bin/env node
var express = require('express');
var app = express(); 
var request = require('request');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// default to a 'localhost' configuration:
var connection_string = 'mydb';

// switch when run on openshift cloud
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var mongojs = require('mongojs');
var db = mongojs(connection_string, ['books']);
var books = db.collection('books');

//googlebookapi url constant
var GBOOKAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

// define path to folder for serving static files
app.use(express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));

// middleware to read form post values
app.use(express.json());

// ROOT logic
app.get('/', function(req, res){
    db.books.find().sort({$natural: -1}, function(err, books) {
        res.render('index.jade', {"books": books});
    });
});


// POST add a book to collection logic
app.post('/addBook', function(req, res) {
    var inputData;

    // Is book with isbn information
    if (req.body.isbn) {
        request(GBOOKAPI + req.body.isbn, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                console.log(body);
                res.status(200).send(body);
                //inputData = JSON.parse(body).items[0].volumeInfo;

                //if(!inputData.imageLinks) {
                    //inputData.imageLinks = {smallThumbnail : 'img/default.jpg'};
                //}

                //try {
                    //db.books.save({
                        //title: inputData.title,
                        //author: inputData.authors[0],
                        //coverLink: inputData.imageLinks.smallThumbnail,
                        //date: new Date(req.body.date).toDateString(),
                        //type: req.body.book_type,
                        //rating: req.body.rating,
                        //lang: req.body.book_lang
                    //}, function(err, saved) {
                        //if (!err) {
                            //res.status(200).send('Book saved successfully');
                            //console.log("Book saved");
                        //} else {
                            //res.status(500).send('issues while saving');
                            //console.log("Issue while saving");
                        //}
                    //});
                //} catch (err) {
                    //console.log(err);
                    //res.status(500).send('issues while saving');
                //}
            } else {
                console.log("googleBooksResponse: ",response);
                res.status(500).send('issues while retrieving googleapi info');
            }
        });
    //no isbn - custom entry
    } else {
        inputData = req.body;
        db.books.save({
            title: inputData.title,
            author: inputData.author,
            coverLink: 'img/default.jpg',
            date: new Date(inputData.date).toDateString(),
            type: inputData.book_type,
            rating: inputData.rating,
            lang: inputData.book_lang
        }, function(err, saved) {
            if (!err) {
                res.status('200').send(inputData);
                console.log("Book saved");
            } else {
                console.log("Issue while saving");
            }
        });
    }
});

app.get('/books', function(req, res){
    db.books.find(function(err, allBooks) {
        console.log(allBooks);
        res.send(allBooks);
    });
});


//app.listen(3000);
//console.log('Listening on port 3000');
app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
    Date(Date.now() ), ipaddress, port);
});
