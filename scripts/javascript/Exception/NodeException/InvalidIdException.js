var InvalidIdException = function(id){
    NodeException.call(this, id);
    this.label += "->InvalidIdException";
    if(isNaN(id)) this.message = this.label +": the id("+id+") is not a number";
    else if (id <= 0) this.message = this.label +": the id("+id+") <= 0";
    else if(id !== parseInt(id)) this.message = this.label +": the id("+id+") is not an integer";
}
