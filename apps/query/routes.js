var GBOOKAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
var cachedBook = {};

var routes = function(app, request, db) {
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
};

module.exports = routes;
