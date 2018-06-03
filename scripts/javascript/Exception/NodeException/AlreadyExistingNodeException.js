var AlreadyExistingNodeException = function(id){
    NodeException.call(this,id);
    this.label += "->AlreadyExistingNodeException";
    this.message = this.label+": the Node(id="+id+") already exists !";
}


