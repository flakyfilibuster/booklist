var Comm = (function () {

    var POST = "POST",
        GET = "GET";

    var Comm = function (config) {
        this.endpoint = config.endpoint;
    };

    Comm.prototype.addBook = function(data, success, error) {
        console.log("data: ", data);
        this.request(POST, "/addBook", data, success, error);
    }

    Comm.prototype.request = function(method, api, params, cbSuccess, cbError) {
        var xhr = new XMLHttpRequest(),
            url = this.endpoint + api;
            //url = api;

        console.log(method, url, params);    
        xhr.open(method, url, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(">>> 200 xhr: ", xhr);
                cbSuccess(xhr.response);
            }
            if (xhr.status === 500) {
                console.log(">>> 500 xhr: ", xhr);
                cbError(xhr.response);
            }
        };

        xhr.onerror = function (err) {
            console.log(">>> err xhr: ", xhr);
            cbError("server issues");
        };


        // FIND OUT, WHY THIS IS CAUSING SO MUCH TROUBLE WITH POSTING THE DATA!
        //if (method === POST) {
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded", false);
        //}

        xhr.send(null);

    };

    Comm.prototype.Name = "Comm";
    return Comm;
}());
