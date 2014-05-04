// namespacing - probably should be done in an init?
var FLAKY = {};
    
FLAKY.xhr = (function () {

    // variable to hold our XHR instance
    var instance;

    // Singleton / private methods and variables
    function init() {

        // define constants
        var POST   = "POST",
            DELETE = "DELETE",
            GET    = "GET";

        var request = function(method, url, params, cbSuccess, cbError) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    cbSuccess(xhr.response);
                }
                if (xhr.status === 500) {
                    cbError(xhr.response);
                }
            };

            xhr.onerror = function (err) {
                cbError("server issues");
            };

            if (method === POST) {
                xhr.setRequestHeader("Content-type", "application/json", false);
            }

            xhr.send(params);
        };

        // All public methods / variables
        return {
            addBook : function(success, error) {
                request(POST, "/addBook", "", success, error);
            },

            deleteBook : function(data, success, error) {
                request(DELETE, "/deletebook/"+data, data, success, error);
            },

            queryBook : function(data, success, error) {
                request(POST, "/queryBook", data, success, error);
            }
        };
    }

    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

            if ( !instance ) {
                instance = init();
            }

            return instance;
        }
    };


}());
