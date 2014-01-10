(function (window, Comm) {

    var comm         = new Comm({ endpoint: "" }),
        _data        = books,
        doc          = window.document,
        addButton    = doc.getElementById('addBookBtn'), 
        openIsbnForm = doc.querySelector('.icon-barcode'),
        openCustForm = doc.querySelector('.icon-pencil'),
        form         = doc.getElementById("addBook"),
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
                console.log("success main.js");
                //bookPreview(success);
                displayer(succAlert);
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
        var myThumb = JSON.parse(previewJSON).items[0].volumeInfo.imageLinks.thumbnail
        var myPreview = document.createElement("div");
            myPreview.innerHTML = '<img src="{}">'.replace("{}", myThumb);
        form.parentNode.replaceChild(myPreview, form);
    }

    // CURRENTLY UNNEEDED
    // Add books to the document table
    //function addBooksToList(books) {
        //var i, len, author, title, cover, micro, html = "";

        //for (i = 0, len = books.length; i<len; i++ ) {
            //author = books[i].author;
            //title  = books[i].title; 
            //cover = books[i].coverLink;
            //micro = new Y.Template();
            //html += micro.render('<tr><td><%= this.title %></td><td><%= this.author %></td><td>12.12.1999</td><td><img alt="<%=this.title%>"  src=<%= this.cover %></td></tr>', 
                                   //{title: title, author: author, cover: cover});
        //} 
        //Y.one(".list-wrapper").append(html);
    //};


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
