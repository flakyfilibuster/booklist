var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        User.findById(user._id, function(err, user) {
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
            User.findOne({ 'username' :  username }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, false, req.flash('error', 'That username is already taken.'));
                } else {

                    
                    var newUser = new User({});
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);

                    newUser.save(function(err) {
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
            User.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err){
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }

                // all is well, return successful user
                return done(null, user);
            });
    }));

};
