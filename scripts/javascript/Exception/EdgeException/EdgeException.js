
    var EdgeException = function(start, dest){
        Exception.call(this);
        this.start = start;
        this.dest = dest;
        
        this.label += "->EdgeException";
        this.message = this.label+": an unexpected error occurred on the edge between nodes "+this.start+" and "+this.dest+".";
    }

