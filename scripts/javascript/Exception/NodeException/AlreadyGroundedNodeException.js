var AlreadyGroundedNodeException = function(id){
    NodeException.call(this, id);
    this.label += "->AlreadyGroundedNodeException";
    this.message =this.label + ": the node identifyed by the id("+this.id+") is already grounded";
}