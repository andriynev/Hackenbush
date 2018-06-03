// M. Sablonniere's function
(function(){
	// Use this to set and get the current page
	page: '',

	// Handler for hashchange events
	hackenbush.controller.onhashchange = function() {
		var hashParams = hackenbush.controller.getHashParams();
		hackenbush.controller.page = hashParams.page ? hashParams.page : hackenbush.controller.page;
		if (hashParams.page) {
		  hackenbush.views.page.selectedPage(hackenbush.controller.page);
		  hackenbush.views.page.loadPage(hashParams.page);
		}
	};

	// Recover parameters from hash
	hackenbush.controller.getHashParams = function() {
		if (window.location.hash.length != 0) {
			var hash = window.location.hash.substr(1).split('/');
			return {
			page: hash[0],
			id: hash[1]
			};
		} else {
			return {
			page: null,
			id: null
			};
		}
	};

	// Listen for hashchange events and use hackenbush.controller.onhashchange handle method
	// Direct listener technique to be able to simulate the event on page load
	window.onhashchange = hackenbush.controller.onhashchange.bind(hackenbush.controller);
	$(window.onhashchange);
})();

