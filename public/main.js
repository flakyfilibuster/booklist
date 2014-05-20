(function() {

    //create NS
    //
    window.flaky = {
        xhr: null,
        util: null,
        init: null,
        version: '000000.1'
    }

    window.flaky.init = function (window) {

        "use strict";

        var doc          = window.document,
            xhr          = flaky.xhr,
            util         = flaky.util,
            comm         = xhr.getInstance(),
            q$           = util.q$,
            c$$          = util.c$$,
            queryButton  = q$(doc, '#addBookBtn'),
            openIsbnForm = q$(doc, '.openform'),
            form         = q$(doc, "#addBook"),
            table        = q$(doc, 'table'),
            previewBox   = q$(doc, '.preview-box'),
            succAlert    = q$(doc, '.alert-success'),
            failAlert    = q$(doc, '.alert-error'),
            queryloading = q$(doc, '.query-loading'),
            bookAccept   = q$(doc, '.book-accept'),
            bookDecline  = q$(doc, '.book-decline');


        // Add Book to the database
        function addBook(e) {
            e.stopPropagation();
            comm.addBook(
                function(rsp) {
                    c$$(previewBox, 'hide', 'add');
                    updateBooklist(rsp, "add");
                },
                function(err) {
                    console.log("failure main.js");
                }
            );
        }

        // Remove Book from database
        function deleteBook(e) {
            //need to check for class as we delegate the click to whole table
            if(!e.target.classList.contains('delete')){
                return;
            }
            e.stopPropagation();
            e.preventDefault();

            var confirmation = confirm('Are you sure you want to delete this book?');

            if(confirmation) {
                var bookID = e.target.parentElement.rel;
                comm.deleteBook(bookID,
                    function(rsp) {
                        updateBooklist(rsp, "delete");
                    },
                    function(err) {
                    }
                );
            }
        }

        function updateBooklist(data, option){
            var bookTable = q$(doc, '.list-container tbody'),
                bookNumber = q$(doc, 'header h1 span');
            bookTable.innerHTML = data;
            if ("add" === option) {
                bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)+1;
                return;
            }
            bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)-1;
        }



        // Handler if this is not the requested book
        function declineBook(e) {
            c$$(q$(previewBox, '.img-container'), 'in', 'remove');
            c$$(q$(previewBox, '.description'), 'in', 'remove');
            c$$(q$(previewBox, '.controls'), 'in', 'remove');
            setTimeout(function() {
                c$$(previewBox, 'hide', 'add');
                c$$(form, 'hide', 'remove');
                form.isbn.focus();
            },800);
            form.date.value = util.dater();
        }


        // Query Book via ISBN
        function queryBook(e) {
            e.preventDefault();
            c$$(form, 'hide', 'toggle');
            c$$(queryloading, 'hide', 'toggle');
            var oMyForm = util.formScraper(form);
            form.reset();
            comm.queryBook(oMyForm,
                function(rsp) {
                    c$$(queryloading, 'hide', 'toggle');
                    bookPreview(rsp);
                }, 
                function(err) {
                    queryBookErrorHandler(err);
                }
            );
        }


        function queryBookErrorHandler(error) {
            c$$(queryloading, 'hide', 'toggle');
            var errorFlash = q$(doc, '.form-error');
            errorFlash.innerHTML = '<b>'+error+'</b>';
            form.date.value = util.dater();
            c$$(form, 'hide', 'toggle');
            c$$(errorFlash, 'hide', 'toggle');

            setTimeout(function() {
                c$$(errorFlash, 'hide', 'toggle');
            }, 2000);
        }

        function bookPreview(previewJSON) {
            // TODO: Replace with severside template
            var previewInfo     = JSON.parse(previewJSON),
                imgContainer    = q$(previewBox, '.img-container'),
                descContainer   = q$(previewBox, '.description'),
                myPreviewImg    = imgContainer.cloneNode(true),
                myPreviewDesc   = descContainer.cloneNode(true);

            myPreviewImg.innerHTML = '<img class="img-thumbnail" src='+previewInfo.coverLink.thumbnail+'>';
            myPreviewDesc.innerHTML = '<h4>'+previewInfo.title+'</h4><p>'+
                                       previewInfo.author+'</p><p>'+
                                       previewInfo.date+'</p><p>'+
                                       previewInfo.description.slice(0,600)+'...</p>';

            util.replaceWith(imgContainer, myPreviewImg);
            util.replaceWith(descContainer, myPreviewDesc);

            c$$(queryloading, 'hide', 'add');
            c$$(previewBox, 'hide', 'remove');

            setTimeout(function() {
                c$$(q$(previewBox, '.img-container'), 'in', 'add');
                c$$(q$(previewBox, '.description'), 'in', 'add');
                c$$(q$(previewBox, '.controls'), 'in', 'add');
            },100);
        }


        function revealForm(e) {
            // TODO: either remove author title entry or support on server
            //Prefill todays date in datepicker
            form.date.value = util.dater();

            c$$(form, 'hide', 'toggle');

            if (e.target.className !== "icon-barcode"){
                c$$(q$(form, "#author").parentNode, 'hide', 'add');
                c$$(q$(form, "#title").parentNode, 'hide', 'add');
                c$$(q$(form, "#isbn").parentNode, 'hide', 'remove');
                form.date.value = util.dater();
            } else {
                c$$(q$(form, "#isbn").parentNode, 'hide', 'add');
                c$$(q$(form, "#author").parentNode, 'hide', 'remove');
                c$$(q$(form, "#title").parentNode, 'hide', 'remove');
            }
        }

        util.addHandler(form, 'submit', queryBook);
        util.addHandler(openIsbnForm, 'click', revealForm);
        util.addHandler(bookAccept, 'click', addBook);
        util.addHandler(bookDecline, 'click', declineBook);
        util.addHandler(table, 'click', deleteBook);

    };
}());
