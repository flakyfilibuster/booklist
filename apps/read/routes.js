var Book = require('../../models/book');

var routes = function(app, db){
    app.get('/', function(req, res){
        if(req.user) {
            Book.getAll(req.user.username, function(err, books) {
                res.render(__dirname + "/views/index", {
                    amount: books.length,
                    title: " Completed Books",
                    books: books,
                    user: req.user
                });
            });
        } else {
            res.render(__dirname + "/../../views/home");
        }
    });

    app.delete('/deletebook/:id', function(req, res){
        Book.delete(req.user.username, req.params.id);
        Book.getAll(req.user.username, function(err, books) {
            res.render(__dirname + "/views/_booktable", { books: books });
        });
    });
}

module.exports = routes;
