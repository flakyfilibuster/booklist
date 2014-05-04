var mongojs = require("mongojs"),
    db      = require("../config/database"),
    bcrypt  = require('bcrypt-nodejs');

// User class constructor
var User = function(attributes) {
    var key, value;
        for (key in attributes) {
        value = attributes[key];
        this[key] = value;
    }
};

// User 'class' prototype methods
User.prototype.generateHash = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


// UserCtrl
var UserCtrl = {

    key : function() {
        return 'user:'+ process.env.NODE_ENV;
    },

    findOne : function(id, callback) {
        db.collection(this.key()).findOne(id, function (err, user) {
            if (user) {
                // on success instantiate a User & send it back
                user = new User(user);
                callback(null, user);
            } else {
                callback(null, user);
            }
        });
    },

    findById : function(id, callback) {
        db.collection(this.key()).findOne({
            _id : mongojs.ObjectId(id) 
        }, function(err, user) {
            callback(null, user);
        });
    },

    save : function(user, callback) {
        db.collection(this.key()).save(user, function(err, code) {
            callback(null, user);
        });
    },
};

exports.user     = User;
exports.userCtrl = UserCtrl;

