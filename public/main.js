"use strict";

(function (window, xhr, util) {

    var doc          = window.document,
        comm         = xhr.getInstance(),
        queryButton  = util.q$(doc, '#addBookBtn'),
        openIsbnForm = util.q$(doc, '.openform'),
        form         = util.q$(doc, "#addBook"),
        table        = util.q$(doc, 'table'),
        previewBox   = util.q$(doc, '.preview-box'),
        succAlert    = util.q$(doc, '.alert-success'),
        failAlert    = util.q$(doc, '.alert-error'),
        queryloading = util.q$(doc, '.query-loading'),
        bookAccept   = util.q$(doc, '.book-accept'),
        bookDecline  = util.q$(doc, '.book-decline');


    // Add Book to the database
    function addBook(e) {
        e.stopPropagation();
        comm.addBook(
            function(rsp) {
                util.c$$(previewBox, 'hide', 'add');
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
        var bookTable = util.q$(doc, '.list-container tbody'),
            bookNumber = util.q$(doc, 'header h1 span');
        bookTable.innerHTML = data;
        if ("add" === option) {
            bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)+1;
            return;
        }
        bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)-1;
    }



    // Handler if this is not the requested book
    function declineBook(e) {
        util.c$$(util.q$(previewBox, '.img-container'), 'in', 'remove');
        util.c$$(util.q$(previewBox, '.description'), 'in', 'remove');
        util.c$$(util.q$(previewBox, '.controls'), 'in', 'remove');
        setTimeout(function() {
            util.c$$(previewBox, 'hide', 'add');
            util.c$$(form, 'hide', 'remove');
            form.isbn.focus();
        },800);
        form.date.value = util.dater();
    }


    // Query Book via ISBN
    function queryBook(e) {
        e.preventDefault();
        util.c$$(form, 'hide', 'toggle');
        util.c$$(queryloading, 'hide', 'toggle');
        var oMyForm = util.formScraper(form);
        form.reset();
        comm.queryBook(oMyForm,
            function(rsp) {
                util.c$$(queryloading, 'hide', 'toggle');
                bookPreview(rsp);
            }, 
            function(err) {
                queryBookErrorHandler(err);
            }
        );
    }


    function queryBookErrorHandler(error) {
        util.c$$(queryloading, 'hide', 'toggle');
        var errorFlash = util.q$(doc, '.form-error');
        errorFlash.innerHTML = '<b>'+error+'</b>';
        form.date.value = util.dater();
        util.c$$(form, 'hide', 'toggle');
        util.c$$(errorFlash, 'hide', 'toggle');
        setTimeout(function() {
            util.c$$(errorFlash, 'hide', 'toggle');
        },2000)
    }

    function bookPreview(previewJSON) {
        var previewInfo     = JSON.parse(previewJSON),
            imgContainer    = util.q$(previewBox, '.img-container'),
            descContainer   = util.q$(previewBox, '.description'),
            myPreviewImg    = imgContainer.cloneNode(true),
            myPreviewDesc   = descContainer.cloneNode(true);

        myPreviewImg.innerHTML = '<img class="img-thumbnail" src='+previewInfo.coverLink.thumbnail+'>';
        myPreviewDesc.innerHTML = '<h4>'+previewInfo.title+'</h4><p>'+
                                   previewInfo.author+'</p><p>'+
                                   previewInfo.date+'</p><p>'+
                                   previewInfo.description.slice(0,600)+'...</p>';

        util.replaceWith(imgContainer, myPreviewImg);
        util.replaceWith(descContainer, myPreviewDesc);

        util.c$$(queryloading, 'hide', 'add');
        util.c$$(previewBox, 'hide', 'remove');

        setTimeout(function() {
            util.c$$(util.q$(previewBox, '.img-container'), 'in', 'add');
            util.c$$(util.q$(previewBox, '.description'), 'in', 'add');
            util.c$$(util.q$(previewBox, '.controls'), 'in', 'add');
        },100);
    }


    function revealForm(e) {
        // TODO: either remove author title entry or support on server
        //Prefill todays date in datepicker
        form.date.value = util.dater();

        util.c$$(form, 'hide', 'toggle');

        if (e.target.className !== "icon-barcode"){
            util.c$$(util.q$(form, "#author").parentNode, 'hide', 'add');
            util.c$$(util.q$(form, "#title").parentNode, 'hide', 'add');
            util.c$$(util.q$(form, "#isbn").parentNode, 'hide', 'remove');
            form.date.value = util.dater();
        } else {
            util.c$$(util.q$(form, "#isbn").parentNode, 'hide', 'add');
            util.c$$(util.q$(form, "#author").parentNode, 'hide', 'remove');
            util.c$$(util.q$(form, "#title").parentNode, 'hide', 'remove');
        }
    }

    util.addHandler(form, 'submit', queryBook);
    util.addHandler(openIsbnForm, 'click', revealForm);
    util.addHandler(bookAccept, 'click', addBook);
    util.addHandler(bookDecline, 'click', declineBook);
    util.addHandler(table, 'click', deleteBook);

}(window, xhr, util));
