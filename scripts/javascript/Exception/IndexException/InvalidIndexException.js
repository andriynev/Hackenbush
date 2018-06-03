var InvalidIndexException = function(index){
    Exception.call(this);
    this.index = index;
    this.label += "->InvalidIndexException";
    if (isNaN(index) || index !== parseInt(index)) this.message = this.label + ": the index("+index+") is not an integer.";
    else if(this.index < 0)this.message = this.label + ": index("+this.index+")"+" < 0.";
    else this.message = this.label +": index("+this.index+") > length.";
}

