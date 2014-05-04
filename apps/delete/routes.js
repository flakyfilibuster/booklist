var Book = require('../../models/book');

module.exports = function(app, db){

    // delete a users book
    app.delete('/deletebook/:id', function(req, res){
        var username = req.user.username;

        Book.delete(username, req.params.id);

        Book.getAll(username, function(err, books) {
            res.render(__dirname + "/../read/views/_booktable", { books: books });
        });
    });
};

