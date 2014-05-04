var BookCtrl = require('../../models/book');

module.exports = function(app, config, request) {
    var GBOOKAPI  = config.googlebooksapi,
        bookQuery = {};

    app.post('/queryBook', function(req, res){
        request(GBOOKAPI + req.body.isbn, function (err, response, body) {
            googleBookRes = JSON.parse(body);

            // query googlebooksapi and see if they have info on it
            if (!err && response.statusCode == 200) {
                if (0 === googleBookRes.totalItems) {
                    res.status(500).send("Book not within Google shelfs");
                    return;
                }

                googleBookRes = googleBookRes.items[0].volumeInfo;

                // take imageLinks or add our default
                googleBookRes.imageLinks = googleBookRes.imageLinks || {
                    smallThumbnail : 'img/default.jpg',
                    thumbnail: 'img/default.jpg'
                };

                // either what's there or our default
                googleBookRes.description = googleBookRes.description ||
                    "Sorry, no description available";


                bookQuery = {
                    title: googleBookRes.title,
                    author: googleBookRes.authors[0],
                    coverLink: googleBookRes.imageLinks,
                    date: new Date(req.body.date).toDateString(),
                    type: req.body.book_type,
                    description :  googleBookRes.description,
                    rating: req.body.rating,
                    lang: req.body.book_lang
                };

                res.status(200).send(bookQuery);

            } else {
                res.status(500).send(err);
            }
        });
    });


    app.post('/addBook', function(req, res) {

        var username = req.user.username;
        bookQuery.coverLink = bookQuery.coverLink.smallThumbnail;

        try {
            BookCtrl.save(username, bookQuery, function(err, saved) {
                if (!err) {
                    // on successful save we send back the updated booktable partial
                    BookCtrl.getAll(username, function(err, books) {
                        res.render("../views/_booktable", { books: books });
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

