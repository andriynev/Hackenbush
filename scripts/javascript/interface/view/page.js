(function() {
	hackenbush.views.page = new Object();
    /** 
	 * Add/remove class inIa at the specified element
	 *
	 * @param element, the element to modified
	 * @param ia, boolean, true if we add the class, false otherwise
	 */		
	function modClassElementIa(element, ia) {
		if (ia) {
			element.addClass('inIa');
		} else {
			if (element.hasClass('inIa')) {
				element.removeClass('inIa');
			}
		}
	}

    /** 
	 * Change element deals with if the selected mode contains an IA or not
	 *
	 * @param element, the element to modified
	 * @param ia, boolean true if an IA is present, false if there is no IA
	 */			
	hackenbush.views.page.modElemIa = function(element, ia) {
		if (element === "mode")
			element = $('#mode-modal');
		else
			element = $('#load-form');
		modClassElementIa(element, ia);
	}

    /** 
	 * Make an element visible or not. 
	 *
	 * @param element a DOM element
	 * @param visible the boolean to make the element visible or not.
	 */			
	hackenbush.views.page.modClassButton = function(element, visible) {
		if (visible) {
			element.addClass('toolChooser');
			element.addClass('button');
			element.removeClass('locked');
		} else {
			element.removeClass('toolChooser');
			element.removeClass('button');
			element.addClass('locked');
		}
	}

    /** 
	 * Lock an element or dislocked the element.
	 *
	 * @param element a DOM element
	 * @param visible the boolean to make the element visible or not.
	 */		
	function modClassBlock(element, visible) {
		if (visible) {
			if (element.hasClass('locked'))
				element.removeClass('locked');
		} else {
			element.addClass('locked');
		}
	}

    /** 
	 * Add Class a specified colored class to an element (blue, green or red)
	 *
	 * @param element a DOM element
	 * @param color string of color needed (blue, green or red)
	 */	
	hackenbush.views.page.modClassColor = function(element, color) {
		if (element.hasClass('blue'))
			element.removeClass('blue');
		if (element.hasClass('red'))
			element.removeClass('red');
		if (element.hasClass('green'))
			element.removeClass('green');

		element.addClass(color);
	}

    /** 
	 * Make the button at the bottom selected (the circle button are surrounded of green border), the previous selected button are unselected
	 *
	 * @param page the string name of current page (recup by the hash and M. Sabloniere's function
	 */	
	hackenbush.views.page.selectedPage = function(page) {
		var prevSelectedId = $('.selected');
		prevSelectedId.addClass('button-bottom');
		prevSelectedId.removeClass('selected');
		var selectedId = $('#'+page);
		selectedId.removeClass('button-bottom');
		selectedId.addClass('selected');
	};

    /** 
	 * Load page, depend of the argument "page", make the element or page visible or hidden. And in some case, launch the ajax load to recup informations of a specified page and implement those in the current page.
	 *
	 * @param page the string name of current page (recup by the hash and M. Sabloniere's function)
	 */	
	hackenbush.views.page.loadPage = function(page) {
		var mainContainer = $('#main-container-canvas');
		if (page === "edition" || page === "play") {
			var containerToHide = $('.visible'); // make the page test.html or the edition page visible/invisible
			containerToHide.removeClass('visible');
			containerToHide.addClass('hidden');
			mainContainer.removeClass('hidden');
			mainContainer.addClass('visible');

			var toModif = false;

			var colorChooser = $('.colorChooser');
			var load = $('#load');

			hackenbush.controller.loadMode("humanVsIa");
			hackenbush.controller.reset();
			load.unbind('click');
			hackenbush.controller.listenToolChooserInPlay();
			hackenbush.views.drawingArea.tool = "draw";

			if (page === "edition" && mainContainer.hasClass('lock')) { // to switch between edition and play, we need just to modify the button (to unlock/lock them).
				mainContainer.removeClass('lock');
				mainContainer.addClass('no-lock');

				colorChooser.addClass('button');
				colorChooser.removeClass('locked');

				hackenbush.views.page.modClassButton(load, true);

				toModif = true;
				var visible = true;
			}
			else if (page === "play") {
				mainContainer.addClass('lock');
				mainContainer.removeClass('no-lock');

				colorChooser.removeClass('button');
				colorChooser.addClass('locked');
				if (hackenbush.controller.playerColors !== undefined) {
					hackenbush.views.page.modClassColor($('#p1Color'), hackenbush.controller.playerColors[0]);
					hackenbush.views.page.modClassColor($('#p2Color'), hackenbush.controller.playerColors[1]);
				}

				hackenbush.views.page.modClassButton(load, true);

				toModif = true;
				var visible = false;
			}
			if (toModif) {
				hackenbush.views.page.modClassButton($('.hideInPlay'), visible);
				modClassBlock($('.informations'), !visible);
				modClassBlock($('.options'), visible);
				modClassBlock($('.startbg'), !visible);
			}
		}
		else {
			hackenbush.controller.loadAjax(page);
			mainContainer.addClass('hidden');
		}
	};

    /** 
	 * Recup the data of a specified page to inject it in the current page.
	 *
	 * @param page the string name of current page (recup by the hash and M. Sabloniere's function
	 */	
	hackenbush.controller.loadAjax = function(page) {
		$.ajax({
			type: 'POST',
			url: './views/'+page+'.html',		
			success: function(data)	{
				var mainContainer = $('#main-container-'+page);
				mainContainer.html(data);
				mainContainer.removeClass('hidden');
				mainContainer.addClass('visible');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('Error: ' + textStatus);
			}
		});
	};
})();
