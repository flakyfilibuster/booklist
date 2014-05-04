var BookCtrl = require('../../models/book');

module.exports = function(app, db){

    // delete a users book
    app.delete('/deletebook/:id', function(req, res){
        var username = req.user.username;

        BookCtrl.delete(username, req.params.id);

        BookCtrl.getAll(username, function(err, books) {
            res.render("../views/_booktable", { books: books });
        });
    });
};

