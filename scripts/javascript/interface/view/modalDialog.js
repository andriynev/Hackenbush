(function() {
	// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
	
	var name = $( "#name" ),
		allFields = $( [] ).add( name );
	
	$('#save-form').dialog({
		autoOpen: false,
		height: 228,
		width: 350,
		modal: true,
		buttons: {
			"Save a Graph": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );

				bValid = bValid && hackenbush.controller.checkLength( name, "Graph Name", 3, 16 );

				bValid = bValid && hackenbush.controller.checkRegexp( name, /^([0-9a-zA-Z])+$/, "Graph Name only allow : a-z 0-9" );
				if ( bValid ) {
					var canvas = hackenbush.views.drawingArea.canvas[0];
					var graphUi = hackenbush.views.drawingArea.graphUi;
					var imageData = hackenbush.controller.saveAsPNG(canvas, 200, 150);
					if (canvas !== undefined && graphUi !== undefined && imageData !== undefined)
						hackenbush.controller.saveGame(name.val(), hackenbush.controller.playerColors, graphUi, imageData);
					$( this ).dialog( "close" );
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});

	$('#load-form').dialog({
		autoOpen: false,
		height: 500,
		width: 800,
		modal: true,
		buttons: {
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});

	$('#help-modal').dialog({
		autoOpen: false,
		height: 500,
		width: 600,
		modal: true,
		buttons: {
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});

	$('#mode-modal').dialog({
		autoOpen: false,
		height: 675,
		width: 723,
		modal: true,
		buttons: {
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
})();