"use strict";

var util =  {

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
    }
};
