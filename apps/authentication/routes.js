var routes = function(app, passport){

    app.get('/login', function(req, res){
        if(req.user) {
            res.redirect('/');
            return;
        }

        res.render("../views/login", {
            title: "Login",
            messages: req.flash()
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        res.render("../views/signup", {
            title: "SignUp",
            messages: req.flash()
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', 
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
};

module.exports = routes;

