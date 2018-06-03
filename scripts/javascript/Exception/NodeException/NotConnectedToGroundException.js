var NotConnectedToGroundException = function(id){
    NodeException.call(this, id);
    this.label += "->NotConnectedToGroundException";
    this.message =this.label + ": the node identifyed by the id("+this.id+") is not grounded";
}