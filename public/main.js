(function (window, Comm) {

    "use strict";

    var comm         = new Comm({ endpoint: "" }),
        doc          = window.document,
        queryButton  = doc.getElementById('addBookBtn'),
        openIsbnForm = doc.querySelector('.openform'),
        form         = doc.getElementById("addBook"),
        table        = doc.querySelector('table'),
        previewBox   = doc.querySelector('.preview-box'),
        succAlert    = doc.querySelector('.alert-success'),
        failAlert    = doc.querySelector('.alert-error'),
        bookAccept   = doc.querySelector('.book-accept'),
        bookDecline  = doc.querySelector('.book-decline');

    //Prefill todays date in datepicker
    function dater() {
       form.date.value = new Date().toISOString().slice(0,10);
    }

    // Add Book to the database
    function addBook(e) {
        e.stopPropagation();
        comm.addBook("",
            function(rsp) {
                console.log("success main.js");
                previewBox.classList.add('hide');
                updateBooklist(rsp, "add");
            },
            function(err) {
                console.log("failure main.js");
            }
        );
    }

    // Remove Book from database
    function deleteBook(e) {
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
        var bookTable = doc.querySelector('.list-container tbody');
        var bookNumber = doc.querySelector('header h1 span');
        bookTable.innerHTML = data;
        if("add" === option) {
            bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)+1;
        } else {
            bookNumber.innerHTML = parseInt(bookNumber.innerHTML, 10)-1;
        }
    }



    // Handler if this is not the requested book
    function declineBook(e) {
        previewBox.querySelector('.img-container').classList.remove('in');
        previewBox.querySelector('.description').classList.remove('in');
        previewBox.querySelector('.controls').classList.remove('in');
        setTimeout(function() {
            previewBox.classList.add('hide');
            form.classList.remove('hide');
            form.isbn.focus();
        },800);
        dater();
    }


    // Query Book via ISBN
    function queryBook(e) {
        e.preventDefault();
        var oMyForm = formScraper(form);
        form.reset();
        comm.queryBook(oMyForm,
            function(rsp) {
                bookPreview(rsp);
            }, 
            function(err) {
                console.log("failure main.js: ", err);
            }
        );
    }

    function formScraper(form) {
        var formDataObj = {};

        for(var i = 0; i<form.length; i++){
            if(form[i].tagName === "INPUT"){
                if(form[i].type === "radio" && form[i].checked){
                   formDataObj[form[i].name] = form[i].value;
                }else if(form[i].type != "radio"){
                   formDataObj[form[i].name] = form[i].value;
                }
            }
        }
        return JSON.stringify(formDataObj);
    }

    function bookPreview(previewJSON) {
        var previewInfo     = JSON.parse(previewJSON),
            title           = previewInfo.title,
            author          = previewInfo.author,
            thumb           = previewInfo.coverLink.thumbnail,
            date            = previewInfo.date,
            desc            = previewInfo.description,
            imgContainer    = previewBox.querySelector('.img-container'),
            descContainer   = previewBox.querySelector('.description'),
            myPreviewImg    = imgContainer.cloneNode(true),
            myPreviewDesc   = descContainer.cloneNode(true);

            myPreviewImg.innerHTML = '<img class="img-thumbnail" src='+thumb+'>';
            myPreviewDesc.innerHTML = '<h4>'+title+'</h4><p>'+author+'</p><p>'+date+'</p><p>'+desc.slice(0,600)+'...</p>';

        imgContainer.parentNode.replaceChild(myPreviewImg, imgContainer);
        descContainer.parentNode.replaceChild(myPreviewDesc, descContainer);
        previewBox.classList.remove('hide');
        form.classList.add('hide');
        setTimeout(function() {
            previewBox.querySelector('.img-container').classList.add('in');
            previewBox.querySelector('.description').classList.add('in');
            previewBox.querySelector('.controls').classList.add('in');
        },100);
    }


    var revealForm = (function(e) {
        // little fucked up closure for button inner text magic...
        var buttonPhrase = "Nevermind... Let me see the list";
        return function(e) {
            var interimVar = e.target.innerHTML;
            e.target.innerHTML = buttonPhrase;
            buttonPhrase = interimVar;

            form.classList.toggle('hide');

            if (e.target.className !== "icon-barcode"){
                form.querySelector("#author").parentNode.classList.add('hide');
                form.querySelector("#title").parentNode.classList.add('hide');
                form.querySelector("#isbn").parentNode.classList.remove('hide');
                dater();
            } else {
                form.querySelector("#isbn").parentNode.classList.add('hide');
                form.querySelector("#author").parentNode.classList.remove('hide');
                form.querySelector("#title").parentNode.classList.remove('hide');
            }
        }
    }());



    // Validate the form input 
    function checkForm() {
        addButton.set("disabled", !(title.get('value') && author.get('value')));
    }

    queryButton.addEventListener('click', queryBook, false);
    openIsbnForm.addEventListener('click', revealForm, false);
    bookAccept.addEventListener('click', addBook, false);
    bookDecline.addEventListener('click', declineBook, false);
    table.addEventListener('click', deleteBook, false);

}(window, Comm));
