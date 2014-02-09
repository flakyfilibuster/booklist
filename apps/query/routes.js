var GBOOKAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
var Book = require('../../models/book');

var routes = function(app, request) {
    var book;

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

                book = new Book({
                    title: googleBookRes.title,
                    author: googleBookRes.authors[0],
                    coverLink: googleBookRes.imageLinks,
                    date: new Date(req.body.date).toDateString(),
                    type: req.body.book_type,
                    description :  googleBookRes.description,
                    rating: req.body.rating,
                    lang: req.body.book_lang
                });

                res.status(200).send(book);

            } else {
                res.status(500).send(err);
            }
        });
    });


    app.post('/addBook', function(req, res) {

        book.coverLink = book.coverLink.smallThumbnail;

        try {
            book.save(function(err, saved) {
                if (!err) {
                    // on successful save we send back the updated booktable partial
                    Book.getAll(function(err, books) {
                        res.render(__dirname + "/../read/views/_booktable", { books: books });
                    });
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
};

module.exports = routes;
