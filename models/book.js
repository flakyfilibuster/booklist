var db = require('mongojs').connect('localhost/mydb');

var Book = (function() {

    function Book(attributes) {
        var key, value;
        for (key in attributes) {
            value = attributes[key];
            this[key] = value;
        }
    }

    Book.key = function() {
        return 'book:'+ process.env.NODE_ENV;
    };

    Book.getAll = function(callback) {
        db.collection(Book.key()).find().sort({$natural: -1}, function(err, objects) {
            if(!err) {
                var allBooks = [];
                for(var i = 0, len = objects.length; i<len; i++) {
                    allBooks.push(new Book(objects[i]));
                }
                callback(err, allBooks);
            }
        });
    };

    Book.prototype.save = function(callback) {
        db.collection(Book.key()).save(this, function(err, code) {
            callback(null, this);
        });
    };


    return Book;

})();

module.exports = Book;
