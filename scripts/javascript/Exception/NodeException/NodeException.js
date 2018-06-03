
   var NodeException = function(id){
       this.id = id;
       Exception.call(this);
       this.label += "->NodeException";
       this.message = this.label+": an unexpected error occurred";
   } 
