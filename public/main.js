(function (window, Comm) {

    var comm         = new Comm({ endpoint: "" }),
        _data        = books,
        doc          = window.document,
        addButton    = doc.getElementById('addBookBtn'), 
        openIsbnForm = doc.querySelector('.icon-barcode'),
        openCustForm = doc.querySelector('.icon-pencil'),
        form         = doc.getElementById("addBook"),
        previewBox   = doc.querySelector('.preview-box'),
        succAlert    = doc.querySelector('.alert-success'),
        failAlert    = doc.querySelector('.alert-error');

    //Prefill todays date in datepicker
    function dater() {
       form.date.value = new Date().toISOString().slice(0,10);
    }

    // Add Book to the database
    function addBook(e) {
        e.preventDefault();
        var oMyForm = formScraper(form);
        form.reset();
        comm.addBook(oMyForm, 
            function(success) {
                //console.log("success main.js");
                bookPreview(success);
                //displayer(succAlert);
            }, 
            function(err) {
                console.log("failure main.js");
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
        var previewInfo  = JSON.parse(previewJSON).items[0].volumeInfo,
            title = previewInfo.title,
            author = previewInfo.authors[0],
            thumb = previewInfo.imageLinks.thumbnail,
            date = previewInfo.publishedDate,
            desc = previewInfo.description,
            myPreview = previewBox.cloneNode(true);
            
            myPreview.querySelector('.img-container').innerHTML = '<img src='+thumb+'>';
            myPreview.querySelector('.description').innerHTML = '<h4>'+title+'</h4><p>'+author+'</p></br><p>'+date+'</p></br><p>'+desc+'</p>';
        
        previewBox.parentNode.replaceChild(myPreview, previewBox);
        myPreview.classList.remove('hide');
        form.classList.add('hide');
    }


    var revealForm = function(e) {
        form.classList.remove('hide');

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

    addButton.addEventListener('click', addBook, false);
    openIsbnForm.addEventListener('click', revealForm, false);
    openCustForm.addEventListener('click', revealForm, false);
    dater();

}(window, Comm));
