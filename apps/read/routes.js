var routes = function(app, db){
    app.get('/', function(req, res){
        db.books.find().sort({$natural: -1}, function(err, books) {
            res.render(__dirname + "/views/index", {
                title: "Index",
                books: books,
                stylesheet1: "main",
                stylesheet2: "bootstrap"
            });
        });
    });
}

module.exports = routes;
