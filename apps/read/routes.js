var Book = require('../../models/book');

var routes = function(app, db){
    app.get('/', function(req, res){
        Book.getAll(function(err, books) {
            res.render(__dirname + "/views/index", {
                amount: books.length,
                title: " Completed Books",
                books: books,
                stylesheet1: "main",
                stylesheet2: "bootstrap"
            });
        });
    });

    app.delete('/deletebook/:id', function(req, res){
        Book.delete(req.params.id);
        Book.getAll(function(err, books) {
            res.render(__dirname + "/views/_booktable", { books: books });
        });
    });
}

module.exports = routes;
