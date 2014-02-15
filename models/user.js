var mongojs = require("mongojs"),
    db = require("../config/database"),
    bcrypt  = require('bcrypt-nodejs');

var User = (function() {

    function User(attributes) {
        var key, value;                                                                                                                                                         
            for (key in attributes) {
            value = attributes[key];
            this[key] = value;
        }
    }

    User.key = function() {
        return 'user:'+ process.env.NODE_ENV;
    };
    
    User.findOne = function(id, callback) {                                                                                                                                      
        db.collection(User.key()).findOne(id, function (err, user) {
            if(user){
                var newUser = new User(user);
                callback(null, newUser);
            }else{
                callback(null, user);
            }
        });
    };

    User.findById = function(id, callback) {
        db.collection(User.key()).findOne({ 
            _id : mongojs.ObjectId(id) 
        }, function(err, user) {
            callback(null, user)
        });
    };

    User.prototype.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    User.prototype.save = function(callback) {
        db.collection(User.key()).save(this, function(err, code) {
            callback(null, this);
        });
    };

    return User;

}())

module.exports = User;
