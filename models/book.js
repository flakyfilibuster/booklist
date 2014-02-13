var mongojs = require('mongojs');
var db      = mongojs.connect('localhost/mydb');

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

    Book.getAll = function(user, callback) {
        db.collection(Book.key()+user).find().sort({$natural: -1}, function(err, objects) {
            if(!err) {
                var allBooks = [];
                for(var i = 0, len = objects.length; i<len; i++) {
                    allBooks.push(new Book(objects[i]));
                }
                callback(err, allBooks);
            }
        });
    };

    Book.delete = function(user, id) {
        db.collection(Book.key()+user).remove({ _id : mongojs.ObjectId(id) });
    };

    Book.prototype.save = function(user, callback) {
        db.collection(Book.key()+user).save(this, function(err, code) {
            callback(null, this);
        });
    };


    return Book;

}());

module.exports = Book;
