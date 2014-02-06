(function (window, Comm) {

    "use strict";

    var comm         = new Comm({ endpoint: "" }),
        doc          = window.document,
        queryButton  = doc.getElementById('addBookBtn'),
        openIsbnForm = doc.querySelector('.icon-barcode'),
        openCustForm = doc.querySelector('.icon-pencil'),
        form         = doc.getElementById("addBook"),
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
            function(success) {
                console.log("success main.js");
                previewBox.classList.add('hide');
            },
            function(err) {
                console.log("failure main.js");
            }
        );
    }

    //currently dormant!
    //function insertBook(book){
        
        //book = JSON.parse(book);

        //var TEMPLATE = "<tr>"+
                           //"<td>"+_data.length+"</td>"+
                           //"<td>"+book.title+"</td>"+
                           //"<td>"+book.author+"</td>"+
                           //"<td>"+book.date+"</td>"+
                           //"<td>"+book.type+"</td>"+
                           //"<td>"+book.lang+"</td>"+
                           //"<td data-rating='"+book.rating+"'></td>"+
                           //"<td><img src='"+book.coverLink+"' class='img-polaroid'></td>"+
                       //"</tr>";

        //var newRow = doc.createElement("tr");
        //newRow.innerHTML = TEMPLATE;
        //var firstRow = doc.querySelector(".list-container tbody tr");
        //var parentElement = firstRow.parentNode;
        //parentElement.insertBefore(newRow, firstRow);
    //}



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
            function(success) {
                bookPreview(success);
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
        var previewInfo  = JSON.parse(previewJSON),
            title = previewInfo.title,
            author = previewInfo.author,
            thumb = previewInfo.coverLink.thumbnail,
            date = previewInfo.date,
            desc = previewInfo.description,
            imgContainer  = previewBox.querySelector('.img-container'),
            descContainer = previewBox.querySelector('.description'),
            myPreviewImg  = imgContainer.cloneNode(true),
            myPreviewDesc = descContainer.cloneNode(true);

            myPreviewImg.innerHTML = '<img class="img-polaroid" src='+thumb+'>';
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


    var revealForm = function(e) {
        form.classList.toggle('hide');

        if (e.target.className === "icon-barcode"){
            form.querySelector("#author").parentNode.classList.add('hide');
            form.querySelector("#title").parentNode.classList.add('hide');
            form.querySelector("#isbn").parentNode.classList.remove('hide');
            dater();
        } else {
            form.querySelector("#isbn").parentNode.classList.add('hide');
            form.querySelector("#author").parentNode.classList.remove('hide');
            form.querySelector("#title").parentNode.classList.remove('hide');
        }
    };



    // Validate the form input 
    function checkForm() {
        addButton.set("disabled", !(title.get('value') && author.get('value')));
    }

    queryButton.addEventListener('click', queryBook, false);
    openIsbnForm.addEventListener('click', revealForm, false);
    //openCustForm.addEventListener('click', revealForm, false);
    bookAccept.addEventListener('click', addBook, false);
    bookDecline.addEventListener('click', declineBook, false);

}(window, Comm));
