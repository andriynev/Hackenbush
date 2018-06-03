(function(){
    
    if(!window.hackenbush.controller) window.hackenbush.controller= new Object();

    /** 
	 * Update the tips on a modal-dialog page.
	 *
	 * @param t a string text
	 */	
	hackenbush.controller.updateTips = function(t) {
		var tips = $( ".validateTips" );
		tips
			.text( t )
			.addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
	}

    /** 
	 * Check the length of a string
	 *
	 * @param o a string text
	 * @param n a string text which describe the type of "o" (for the users)
	 * @param min the integer which indicate the minimum length authorized
	 * @param max the integer which indicate the maximum length authorized
	 */	
	hackenbush.controller.checkLength = function(o,n,min,max) {
		if ( o.val().length > max || o.val().length < min ) {
			o.addClass( "ui-state-error" );
			hackenbush.controller.updateTips( "Length of " + n + " must be between " +
				min + " and " + max + "." );
			return false;
		} else {
			return true;
		}
	}

    /** 
	 * Check the caracters of a string
	 *
	 * @param o a string text
	 * @param regexp which caracters are authorized
	 * @param n a string text which describe the type of "o" and authorized string in the function (for the users)
	 */	
	hackenbush.controller.checkRegexp =function(o,regexp,n) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass( "ui-state-error" );
			hackenbush.controller.updateTips( n );
			return false;
		} else {
			return true;
		}
	}
})();