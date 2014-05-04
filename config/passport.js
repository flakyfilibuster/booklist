var LocalStrategy = require('passport-local').Strategy,
    User          = require('../models/user').user,
    UserCtrl      = require('../models/user').userCtrl;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        UserCtrl.findById(user._id, function(err, user) {
            done(err, user);
        });
    });


   passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            UserCtrl.findOne({ 'username' :  username }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(
                        null,
                        false,
                        req.flash('error', 'That username is already taken.')
                    );
                } else {
                    
                    // create a new user and generate a hashed password
                    var newUser = new User({ username: username });
                    newUser.generateHash(password);

                    UserCtrl.save(newUser, function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            UserCtrl.findOne({ 'username' :  username }, function(err, user) {

                // if there are any errors, return the error before anything else
                if (err){
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    return done(
                        null,
                        false,
                        req.flash('error', 'Wrong username or password. Please try again')
                    );
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    return done(
                        null,
                        false,
                        req.flash('error', 'Wrong username or password. Please try again')
                    );
                }

                // all is well, return successful user
                return done(null, user);
            });
    }));
};

