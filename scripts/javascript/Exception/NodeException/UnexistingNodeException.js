var UnexistingNodeException = function(id){
    NodeException.call(this, id);
    this.label += "->UnexistingNodeException";
    this.message = this.label+": the node identified by "+this.id+" doesn't exist.";
} 

