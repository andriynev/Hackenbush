(function(){
    
    hackenbush.controller.playerColors = new Array(); 
    
    /**
     * adds necessary listeners to the tool box (general controller)
     **/
    hackenbush.controller.listenToTools = function(){				
        $("#start").click( function(event) {
            $('.startbg').addClass("locked");
            var load = $('#load');
            hackenbush.views.page.modClassButton(load, false);
            hackenbush.controller.loadMode("humanVsIa");
            load.unbind('click');
            hackenbush.controller.startGame();
        });

        hackenbush.controller.listenToolChooserInEdit();
        hackenbush.controller.listenToolChooserInPlay();
    }
    
    /**
     * adds necessary listeners to the tool box for the toolChooser element in Edition mode
     **/
    hackenbush.controller.listenToolChooserInEdit = function(){
        $(".toolChooser.hideInPlay").click( function(event) {
            var toolSelected = event.currentTarget.id;
            if(toolSelected === "save"){
                $('#save-form').dialog( "open" );
            }
        });   
    }

    /**
     * adds necessary listeners to the tool box for the toolChooser element in Play mode
     **/
    hackenbush.controller.listenToolChooserInPlay = function(){
        $("#load").click( function(event) {
            var loadForm = $('#load-form');
			var d = new Date();
            loadForm.dialog( "open" );
            loadForm.load("./scripts/php/view/loadGame.php?time="+d.getTime()); // to avoid the Internet Explorer's cache, not the same url each time
        });
    }

    /**
     * initializes an array(playerColors) wich know the player colors
     **/
    hackenbush.controller.initPlayerColors = function(){
        var player1 = $("#player1");
        var player2 = $("#player2");
        hackenbush.controller.playerColors[0] = player1[0].value;
        hackenbush.controller.playerColors[1] = player2[0].value;
    }
        
    /**
     * changes the player colors
     * 
     * @param playerInt : an integer representing the player (player1 := 0, player2 := 1)
     **/    
    hackenbush.controller.setPlayerColors = function(playerInt) {
        // VAR
        var player1 = $("#player1");
        var player2 = $("#player2");
        var playerColors = hackenbush.controller.playerColors;
        var player;
            
        
        if(playerInt === 0) player = player1;
        else if(playerInt === 1) player = player2;
        else return;
        //FUNCTION
        function swap(array, i, j){
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        function preventFromSameColor(){
            for(var i = 0; i < playerColors.length; i++){
                if(i !== playerInt){
                    if(playerColors[i] === player[0].value) swap(playerColors, i, playerInt);
                }
            }
            playerColors[playerInt] = player[0].value;
            player1[0].value = playerColors[0];
            player2[0].value = playerColors[1];
        }
        preventFromSameColor();
    };
    
    hackenbush.views.drawingArea.color = "green"; // default color : primary green
    hackenbush.views.drawingArea.tool = "draw"; // default tool : draw
    
    /**
     * adds necessary listeners to the tool box (little view controller)
     **/
    hackenbush.views.drawingArea.listenToTools = function() {
        
        $(".colorChooser").mousedown(function(event){
            hackenbush.views.drawingArea.color = event.currentTarget.id;
            if(hackenbush.views.drawingArea.selectedEdge)hackenbush.views.drawingArea.selectedEdge.weight.color = event.currentTarget.id; 
            hackenbush.views.drawingArea.update();
        });
        
        $("#start").click( function(event) {
            hackenbush.views.drawingArea.buildGraphGame();
            hackenbush.views.drawingArea.selectedEdge = null;
            hackenbush.views.drawingArea.update();
            hackenbush.views.drawingArea.tool = "erase";
        });
        
        $(".toolChooser").click( function(event) {
            var toolSelected = event.currentTarget.id;
            if(toolSelected === "eraseAll") hackenbush.views.drawingArea.eraseAll();
            if(toolSelected === "resetGame") hackenbush.views.drawingArea.resetGame();
            if (toolSelected === "edit" | toolSelected === "draw" | toolSelected === "erase") {
                hackenbush.views.drawingArea.elementSelected(toolSelected);
                hackenbush.views.drawingArea.setCursor(toolSelected);
                hackenbush.views.drawingArea.tool = toolSelected;
            }
            if(toolSelected !== "edit"){
                hackenbush.views.drawingArea.selectedEdge = null;
                hackenbush.views.drawingArea.update();
            }
        });

    }
    hackenbush.controller.initPlayerColors();
    hackenbush.views.drawingArea.listenToTools();
    hackenbush.controller.listenToTools();
})()

