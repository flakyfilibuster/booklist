var mongojs = require("mongojs"),
    db      = require("../config/database");

module.exports = {

    key: function() {
        return 'book:'+ process.env.NODE_ENV;
    },

    getAll : function(user, callback) {
        db.collection(this.key()+user).find().sort({$natural: -1}, function(err, books ) {
            if(!err) {
                callback(err, books);
            }
        });
    },

    delete : function(user, id) {
        db.collection(this.key()+user).remove({ _id : mongojs.ObjectId(id) });
    },

    save : function(user, book, callback) {
        db.collection(this.key()+user).save(book, function(err, code) {
            callback(null, this);
        });
    }
};

