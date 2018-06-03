(function(){
    window.hackenbush = new Object();

    hackenbush.controller = new Object();
    hackenbush.modele = new Object();
    hackenbush.views = new Object();
    
    
    var AbstractView = function() {
        this.selfSynchronization = function(action,args){};
    }
    
    hackenbush.views.drawingArea = new AbstractView();    
})()