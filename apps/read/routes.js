var Book = require('../../models/book');

var routes = function(app, db){
    app.get('/', function(req, res){
        Book.getAll(function(err, books) {
            res.render(__dirname + "/views/index", {
                title: "Completed Books",
                books: books,
                stylesheet1: "main",
                stylesheet2: "bootstrap"
            });
        });
    });
}

module.exports = routes;
