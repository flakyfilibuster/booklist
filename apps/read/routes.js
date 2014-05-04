var BookCtrl = require('../../models/book');

module.exports = function(app, db){

    // user requests root page
    app.get('/', function(req, res){

        // assign the req.user to a local variable, less lookups
        var user = req.user;

        // if we have a user object (read: user is logged in)
        if(user) {

            // get all books for user
            // render index tpl with books info + additional options
            BookCtrl.getAll(user.username, function(err, books) {
                res.render(__dirname + "/views/index", {
                    amount: books.length,
                    title: " Completed Books",
                    books: books,
                    user: user
                });
            });

            return;
        }

        // if there is no user object we render the default home page
        res.render(__dirname + "/../../views/home");
    });
};

