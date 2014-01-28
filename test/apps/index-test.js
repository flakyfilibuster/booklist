require('../_helper.js');

var assert  = require('assert'),
    request = require('request'),
    app     = require('../../server');

describe("index", function() {
    describe("GET /login ", function() {
        var body = null;

        before(function(done) {
            var options = { uri: "http://localhost:" +app.settings.port+  "/login" };
            request(options, function(err, response, _body) {
                body = _body;
                done();
            });
        });

        it("has user field", function() {
            assert.ok(/user/.test(body));
        });

        it("has user field", function() {
            assert.ok(/password/.test(body));
        });

        it("has user field", function() {
            assert.ok(/submit/.test(body));
        });
    });
});
