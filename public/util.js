
flaky.util =  {

    dater : function() {
       return new Date().toISOString().slice(0,10);
    },

    q$ : function(element, target) {
        return element.querySelector(target); 
    },

    c$$ : function(element, style, command) {
        switch(command) {
            case 'add':
                return element.classList.add(style); 
            case 'remove':
                return element.classList.remove(style); 
            case 'toggle':
                return element.classList.toggle(style); 
            default:
                console.warn('no such command');
        }
    },

    formScraper : function(form) {
        var result = Array.prototype.reduce.call(form, function (formDataObj, current) {
            if(current.tagName === "INPUT"){
                if(current.type === "radio" && current.checked){
                   formDataObj[current.name] = current.value;
                }else if(current.type != "radio"){
                   formDataObj[current.name] = current.value;
                }
            }
            return formDataObj;
        },{});
        return JSON.stringify(result);
    },

    replaceWith : function(previous, current) {
        previous.parentNode.replaceChild(current, previous);
    },

    addHandler : function(element, on, callback) {
        element.addEventListener(on, callback, false);
    }

};
