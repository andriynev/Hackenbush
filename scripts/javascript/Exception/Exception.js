var Exception = function(){
    Error.call(this);
    this.label = "Exception";
    this.message = this.label+": an unexpected error occurred";
    
    this.log = function(){
        console.log(this.message);
    }
}