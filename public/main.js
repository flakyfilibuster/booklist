(function (window, Comm) {

    var comm         = new Comm({ endpoint: "" }),
        _data        = books,
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
        //form.reset();
        comm.addBook("",
            function(success) {
                console.log("success main.js");
                displayer(succAlert);
                previewBox.classList.add('hide');
            },
            function(err) {
                console.log("failure main.js");
                displayer(failAlert);
            }
        );
    }

    // Handler if this is not the requested book
    function declineBook(e) {
        previewBox.classList.add('hide');
        form.classList.remove('hide');
        form.isbn.focus();
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
                displayer(failAlert);
            }
        );
    }

    function formScraper(form) {
        formDataObj = {};

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

    function displayer(element) {
       element.classList.toggle('hide'); 
       setTimeout(function () {
           element.classList.toggle('hide');
       }, 3000);
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
    }


    var revealForm = function(e) {
        form.classList.toggle('hide');

        if (e.target.className === "icon-barcode"){
            form.querySelector("#author").parentNode.classList.add('hide');
            form.querySelector("#title").parentNode.classList.add('hide');
            form.querySelector("#isbn").parentNode.classList.remove('hide');
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
    dater();

}(window, Comm));
