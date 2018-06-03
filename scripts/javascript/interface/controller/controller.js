(function(){
    
    /* VAR */
    hackenbush.controller.isPlaying = false;
    hackenbush.controller.playersNature = [true, false]; //human := true, computer :=false
    hackenbush.controller.currentTurnElem = $("#currentTurn");
    hackenbush.controller.currentPlayerElem = $("#currentPlayer");
    hackenbush.controller.currentTurn = 1;
    hackenbush.controller.currentPlayer = 0;
    hackenbush.controller.turnPlayed = false;
    hackenbush.controller.AI = new AIPlayer12();
    hackenbush.controller.canvasUnbinded = false;
    
    
    /* METHODS */
    
    /**
     * sychronize the views together.
     * 
     * @param action : a strig value indicating what to synchronize
     * @param args : an array of arguments to perform the action 
     *
     **/
    hackenbush.controller.synchronizeViews = function(action, args) {
        for(var viewKey in hackenbush.views){
            if(hackenbush.views[viewKey].selfSynchronization){
                hackenbush.views[viewKey].selfSynchronization(action, args);
            }
        }
    }
    
    /**
     * set the graphGame 
     * 
     * @param graph : the graph given to the graphGame
     **/
    hackenbush.controller.buildGraphGame = function(graph){
        hackenbush.modele.graphGame = graph;
    };
    
    
    /**
     * remove an edge in the graphGame and all the edge unconnected to the ground.
     * 
     * @param startId : the node identified by startId
     * @param goalId : the node identifyed bu goalId
     * @param edgeIndex : the index of the edge in the edges array between these two nodes
     **/
    hackenbush.controller.erase = function(startId, goalId, edgeIndex){
        hackenbush.modele.graphGame.removeEdge(startId, goalId, edgeIndex);
        hackenbush.modele.graphGame.removeLonelyNodes();
        hackenbush.modele.graphGame.removeFlyingNodes();
        hackenbush.controller.turnPlayed = true;
    }
    
    /**
     * check if a players have already lost.
     *  
     * @return the color of the winner (2 if nobody wins)
     **/
    hackenbush.controller.playersCanStillWin = function(){
        var colorReference = null;
        var groundedNodesLength = hackenbush.modele.graphGame.getGroundedNodesCount();
        for(var j= 0; j < groundedNodesLength; j++){
            var nodeId = hackenbush.modele.graphGame.groundedNodes[j];
            var neighbors = hackenbush.modele.graphGame.getNodeById(nodeId).neighbors;
            for(var neighborKey in neighbors){
                var edges = neighbors[neighborKey];
                for(var i = 0; i < edges.length; i++){
                    if(colorReference === null) colorReference = edges[i].weight;
                    if(edges[i].weight === 2 || edges[i].weight !== colorReference) return 2;
                }
            }
        }
        return colorReference;
    }
    
    /**
     * initialize and launch the game
     **/
    hackenbush.controller.startGame = function() {
                
        hackenbush.controller.setTurns(hackenbush.controller.currentTurn++);
        hackenbush.controller.isPlaying = true;
        var winner = hackenbush.controller.playersCanStillWin(); 
        if(!hackenbush.modele.graphGame.getOrder()) hackenbush.controller.invalidPlayField("The hackenbush game is empty");
        else if(winner !== 2) hackenbush.controller.win(winner);
        else if(!hackenbush.controller.playersNature[hackenbush.controller.currentPlayer]){
            hackenbush.controller.applyComputerMove();
        }
    }

    /**
     * reset the game
     **/
    hackenbush.controller.reset = function(){
        var winEl = $('#win');
        winEl.addClass('hidden');
        winEl.html("");
        hackenbush.controller.isPlaying = false;
        hackenbush.controller.currentPlayer = 0;
        hackenbush.controller.currentTurn = 0;
        hackenbush.controller.setTurns(hackenbush.controller.currentTurn);
        hackenbush.controller.currentPlayerElem.html('P'+(hackenbush.controller.currentPlayer + 1));
    }
    
    /**
     * vouches for the good conduct of the game
     **/
    hackenbush.controller.applyRules = function(){
        var winner = hackenbush.controller.playersCanStillWin(); 
        if(winner !== 2) hackenbush.controller.win(winner);
        else if(!hackenbush.modele.graphGame.getOrder()) {
            hackenbush.controller.win(hackenbush.controller.currentPlayer);
        }
        else{
            hackenbush.controller.setTurns(hackenbush.controller.currentTurn++);
            setTimeout("hackenbush.controller.switchPlayers()", 500);
            hackenbush.controller.turnPlayed = false;
        }
    }
    
    
    /**
     * gives voice to the next player
     **/
    hackenbush.controller.switchPlayers = function(){
        hackenbush.controller.currentPlayer = (hackenbush.controller.currentPlayer + 1)%2;
        hackenbush.controller.currentPlayerElem.html('P'+(hackenbush.controller.currentPlayer + 1));
        
        if(!hackenbush.controller.playersNature[hackenbush.controller.currentPlayer]){
            hackenbush.controller.unbindDrawingArea();
            hackenbush.controller.applyComputerMove();
        }
        else if(hackenbush.controller.canvasUnbinded){
            for(var viewKey in hackenbush.views){
                if(hackenbush.views[viewKey].listenToDrawingArea) hackenbush.views[viewKey].listenToDrawingArea();
            }
            hackenbush.controller.listenToDrawingArea();
            hackenbush.controller.canvasUnbinded = false;
        }
    }
    
    
    
    /**
     * apply the AI move
     **/
    hackenbush.controller.applyComputerMove = function(){
        var move = hackenbush.controller.AI.play(hackenbush.modele.graphGame, hackenbush.controller.currentPlayer);
        if(!move)hackenbush.controller.win((hackenbush.controller.currentPlayer + 1)%2);//Computer is weak ;)
        else{
            var sourceNodeId = move[0];
            var destNodeId = move[1];
            var edgeCount = hackenbush.modele.graphGame.getEdgeCount(sourceNodeId, destNodeId);
            var i = 0;
            while(i < edgeCount && hackenbush.modele.graphGame.getEdgeValue(sourceNodeId, destNodeId, i) !== hackenbush.controller.currentPlayer){
                i++; 
            }            
            if(hackenbush.modele.graphGame.getEdgeValue(sourceNodeId, destNodeId,i) === hackenbush.controller.currentPlayer){
                hackenbush.modele.graphGame.removeEdge(sourceNodeId, destNodeId, i);
                hackenbush.views.drawingArea.graphUi.removeEdge(sourceNodeId, destNodeId, i);
                hackenbush.views.drawingArea.graphUi.removeFlyingNodes();
                hackenbush.views.drawingArea.update();
            }
            else hackenbush.controller.win((hackenbush.controller.currentPlayer + 1)%2);//Computer is weak ;)
            
            hackenbush.controller.applyRules();
        }
    }
    
    /**
     * prints the curent turn int the html page
     **/
    hackenbush.controller.setTurns = function(turns) {
        hackenbush.controller.currentTurnElem.html(turns);
    }
    
    /**
     * prints a message if the graph game is invalid
     * 
     * @param message : string value
     **/
    hackenbush.controller.invalidPlayField = function(message){
        var winEl = $('#win');
        winEl.removeClass('hidden');
        winEl.html(message);
        hackenbush.controller.turnCounter = 1;
    }

    /**
     * print a message for the winner
     * 
     * @param player : an integer refering to the winner
     **/
    hackenbush.controller.win = function(player) {
        player++;
        hackenbush.controller.canvasWin(player);
        hackenbush.controller.turnCounter = 1;
        hackenbush.controller.setTurns(0);
        
        if(hackenbush.controller.canvasUnbinded){
            hackenbush.controller.listenToDrawingArea();
            for(var viewKey in hackenbush.views){
                if(hackenbush.views[viewKey].listenToDrawingArea) hackenbush.views[viewKey].listenToDrawingArea();
            }
            hackenbush.controller.canvasUnbinded = false;
        }
    }
    
    /**
     * Change the canvas Area to print a message or an image (depending on the type of winning player)
     * 
     * @param player : an integer refering to the winner
     **/
    hackenbush.controller.canvasWin = function(player) {
        var winEl = $('#win');
        winEl.removeClass('hidden');
        var mode = hackenbush.controller.getMode();
        var img = $('<img>', {
            class: 'winCanvas'
        });
        var iconClose = $('<div>', {
            class: 'iconClose'
        });


        winEl.html("Player "+player+" "+"wins !");
        winEl.append(img);
        winEl.append(iconClose);
        iconClose.click( function() {
            img.hasClass('hidden') ? img.removeClass('hidden') : img.addClass('hidden');
        });
    }
    
    /**
     * stop the game
     **/
    hackenbush.controller.stopGame = function() {
        hackenbush.controller.isPlaying = false;
        hackenbush.controller.turnCounter = 1;
        hackenbush.controller.setTurns(0);
        
        if(hackenbush.controller.canvasUnbinded){
            hackenbush.controller.listenToDrawingArea();
            for(var view in hackenbush.views){
                if(view.listenToDrawingArea) view.listenToDrawingArea();
            }
            hackenbush.controller.canvasUnbinded = false;
        }
    }

    /** 
	 * Change the current mode game
	 *
	 * @param mode, string of the choosen mode
	 */	
    hackenbush.controller.loadMode = function(mode) {
        switch (mode) {
            case "humanVsIa":
                hackenbush.controller.playersNature = [true, false];
                hackenbush.views.page.modElemIa("load", true);
                break;
            default:
                hackenbush.controller.playersNature = [true, true];
                hackenbush.views.page.modElemIa("load", false);
                break;
        }
    }

    /** 
	 * Return the actual mode
	 *
	 * @return a string, depending on the current mode
	 */	
    hackenbush.controller.getMode = function() {
        var mode;
        hackenbush.controller.playersNature[0] ? mode="humanVs" : mode="iaVs";
        hackenbush.controller.playersNature[1] ? mode+="Human" : mode+="Ia";
        return mode;
    }

    /** 
	 * Check if the current mode is human vs human or not
	 *
	 * @return a boolean, true if the current mode is a human vs human party
	 */	
    hackenbush.controller.isHumanParty = function() {
        if (hackenbush.controller.getMode() === "humanVsHuman")
            return true;
        else
            return false;
    }

    /** 
	 * Check if the current graph is a Red/Blue graph or not
	 *
	 * @param graph, the graph to analyse
	 * @return a boolean, true if the graph is a red/blue graph
	 */	
    hackenbush.controller.isRedBlueGraph = function(graph) {
        var sourceId, destId, redBlueGraph;
        redBlueGraph = true;
        for (sourceId in graph.nodes) {
            if (!redBlueGraph) break;
            for (destId in graph.nodes[sourceId].neighbors) {
                redBlueGraph = !hackenbush.controller.isAGreenEdge(sourceId, destId);
                if (!redBlueGraph) break;
            }
        }
        return redBlueGraph;
    }

    /** 
	 * Check if there is a green edge contained between two given nodes 
	 *
	 * @param sourceId, hash key of a node
	 * @param destId, hash key of a node
	 * @return boolean, true if there is a green edge
	 */	
    hackenbush.controller.isAGreenEdge = function(sourceId, destId) {
        var greenEdge = false;
        var sId = hackenbush.views.drawingArea.graphUi.splitId(sourceId);
        var dId = hackenbush.views.drawingArea.graphUi.splitId(destId);
        var edgesCount = hackenbush.views.drawingArea.graphUi.getEdgesCount(sId, dId);
        var indexEdge = 0;
        while (!greenEdge && indexEdge < edgesCount) {
            if (hackenbush.views.drawingArea.graphUi.getEdgeValueWithoutCheck(sId, dId, indexEdge).color === "green")
                greenEdge = true;
            indexEdge++;
        }
        return greenEdge;
    }

    /** 
	 * Save a Game
	 *
	 * @param name, a string
	 * @param playerColors, an array
	 * @param graphUi an hashes array
	 * @param imageData, data img of canvas
	 */	
    hackenbush.controller.saveGame = function (name, playerColors, graphUi, imageData) {
        var graphUiObj = hackenbush.controller.arrayToObject(graphUi); // have to convert the hash array in object to pass with no data loss the function JSON.stringify().
        var game = {
            playerColors : playerColors,
            graphUi : graphUiObj
        }
        var gameJson = JSON.stringify(game);
        var imgData = encodeURIComponent(imageData); // have to encode to conserve the sign '+' when there is ajax
        if (graphUiObj.redBlueGraph === true)
            hackenbush.controller.saveToFile('RB_'+name, gameJson, imgData);
        else
            hackenbush.controller.saveToFile(name, gameJson, imgData);
    };

    /** 
	 * Save the game to a file (need php to do this => so we use ajax for js=>php transmission)
	 *
	 * @param name, a string
	 * @param gameJson, game converted in Json (playerColors+graphUi)
	 * @param imageData, data img of canvas
	 */	
    hackenbush.controller.saveToFile = function(name, gameJson, imageData) {
        $.ajax({
            type: 'POST',
            url: './scripts/php/controller/saveGame.php',
            data: 'name='+name+'&data='+gameJson+'&imageData='+imageData,
            success: function() {
                if (name.indexOf('RB_') != -1)
                    name = name.split('RB_')[1];
                $('input').val(name);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error: ' + textStatus);
            }
        });
    };

    /** 
	 * Load a saved Game
	 *
	 * @param name, a string
	 */	
    hackenbush.controller.loadGame = function(name) {
        if (name !== "") {
            var path, random, gameData; // have to init gameData to avoid a closure.
            $('#load-form').dialog("close");
            path = './ressources/savedGames/'+name+'.json';
            random = false;
            $.getJSON(path, function(gameData) {
                hackenbush.controller.objectToArray(hackenbush.views.drawingArea, gameData, random);
                if (!random) {
                    if (name.indexOf('RB_') != -1)
                        name = name.split('RB_')[1];
                    $('input').val(name);
                }
                hackenbush.views.drawingArea.update();
            });
        }
    };

    /* misc */
    /** 
	 * Convert an object to Array (json object to hash array in this case)
	 *
	 * @param graphUi, where we stock the new hash Array
	 * @param data, the data of the graph obtained in a file *.json
	 * @param random, a boolean, if the graph is taken from M. Soulignac's website or not.
	 */	
    hackenbush.controller.objectToArray = function(graphUi, data, random) {
        if (!random) {
            hackenbush.controller.playerColors = data.playerColors;
            data = data.graphUi;
            graphUi = graphUi.graphUi;
            $('#player1').val(hackenbush.controller.playerColors[0]);
            $('#player2').val(hackenbush.controller.playerColors[1]);
            hackenbush.views.page.modClassColor($('#p1Color'), hackenbush.controller.playerColors[0]);
            hackenbush.views.page.modClassColor($('#p2Color'), hackenbush.controller.playerColors[1]);
        }
        hackenbush.controller.getObjProperties(graphUi, data, false, random);
    };

    /** 
	 * Convert array to create new Object
	 *
	 * @param graphUi, a hash table, where the data will be stocked
	 * @return an object with data in graphUi
	 */	
    hackenbush.controller.arrayToObject = function(graphUi) {
        var graphUiObj = new Object();
        graphUiObj.nodes = new Object();
        hackenbush.controller.getObjProperties(graphUiObj, graphUi, true, false);
        return graphUiObj;
    };

    /** 
	 * Get the properties of an element to convert it into a hash table or an object
	 *
	 * @param graphUi, a hash table or an object, where the data will be stocked
	 * @param data, where the data are stocked
	 * @param toObj, a boolean, if you need an object->hash table translation or hash table->object translation
	 * @param random, a boolean, if the graph is taken from M. Soulignac's website or not.
	 */	
    hackenbush.controller.getObjProperties = function(graphUi, data, toObj, random) {
        if (random)
            graphUi.graphUi = hackenbush.controller.getObjPropertiesRandom(data);
        else
            hackenbush.controller.getObjPropertiesNoRandom(graphUi, data, toObj);
    };
    /** 
	 * Get the properties of an element to convert it into a hash table or an object
	 *
	 * @param graphUi, a hash table or an object, where the data will be stocked
	 * @param data, where the data are stocked
	 * @param toObj, a boolean, if you need an object->hash table translation or hash table->object translation
	 */	
    hackenbush.controller.getObjPropertiesNoRandom = function(graphUi, data, toObj) {
        var sourceId, destId, id;
        if (toObj) {
            graphUi.nodes = new Object();
            graphUi.redBlueGraph = true;
        }
        else
            graphUi.nodes = new Array();

        graphUi.groundedNodes = data.groundedNodes;
        graphUi.nodes.length = data.nodes.length;
        graphUi.edgeIdCounter = data.edgeIdCounter;
        graphUi.nodeIdCounter = 0;
        for (sourceId in data.nodes) {
            if (sourceId !== "length") {
                if (toObj) {
                    graphUi.nodes[sourceId] = new Object();
                    graphUi.nodes[sourceId].neighbors = new Object();
                }
                else {
                    graphUi.nodes[sourceId] = new Array();
                    graphUi.nodes[sourceId].neighbors = new Array();
                }
                graphUi.nodes[sourceId].degree = data.nodes[sourceId].degree;
                graphUi.nodes[sourceId].id = data.nodes[sourceId].id;
                graphUi.nodes[sourceId].neighbors.length = data.nodes[sourceId].neighbors.length;
                graphUi.nodes[sourceId].weight = data.nodes[sourceId].weight;
                for (destId in data.nodes[sourceId].neighbors ) {
                    graphUi.nodes[sourceId].neighbors[destId] = data.nodes[sourceId].neighbors[destId];
                    if (toObj && graphUi.redBlueGraph)
                        graphUi.redBlueGraph = !hackenbush.controller.isAGreenEdge(sourceId, destId);
                }
            }
        }
        if ((sourceId !== undefined) && (sourceId !== "length"))
            graphUi.nodeIdCounter = sourceId.replace('#', '')*1;
        if (toObj)
            graphUi.linkedToGround = new Object();
        else {
            graphUi.linkedToGround = new Array();
        }
        for (id in data.linkedToGround) {
            graphUi.linkedToGround[id] = data.linkedToGround[id];
        }
    };

    /** 
	 * Get the properties of an element to convert it into a hash table or an object
	 *
	 * @param graphUi, a hash table or an object, where the data will be stocked
	 * @param data, where the data are stocked
	 */	
    hackenbush.controller.getObjPropertiesRandom = function(data) {
        var graphUi = new HackenbushGraph();
        var nodeId, nId, nX, nY, nWeight;
        var edgeId, sId, dId, color, p1X, p1Y, p2X, p2Y, eWeight;

        graphUi.nodeIdCounter = 0;
        graphUi.edgeIdCounter = 0;

        for (nodeId in data.nodes) {
            nId = data.nodes[nodeId][0];
            nX = data.nodes[nodeId][1]+100;
            nY = data.nodes[nodeId][2]+20;
            nWeight = new Point(nX, nY);
            graphUi.addWeightedNode(nId, nWeight);
            if (nY == 570)
                graphUi.groundNodeNoCheck(nId);
        }
        graphUi.nodeIdCounter = nId+1;
        for (edgeId in data.edges) {
            sId = data.edges[edgeId][0];
            dId = data.edges[edgeId][1];
            color = data.edges[edgeId][2]? "red" : "blue";
            p1X = data.edges[edgeId][3][0]+100;
            p1Y = data.edges[edgeId][3][1]+20;
            p2X = data.edges[edgeId][4][0]+100;
            p2Y = data.edges[edgeId][4][1]+20;

            eWeight = new Object();
            eWeight.color = color;
            eWeight.controlP1 = new Point(p1X, p1Y);
            eWeight.controlP2 = new Point(p2X, p2Y);
            eWeight.startId = sId;
            eWeight.goalId = dId;
			
            graphUi.addWeightedEdge(sId, dId, eWeight);
        }
        return graphUi;
    };

    /** 
	 * Rescale/resize a canvas
	 *
	 * @param oCanvas, the canvas you want to resize
	 * @param iWidth, the integer new width size
	 * @param iWidth, the integer new height size
	 */
    hackenbush.controller.scaleCanvas = function(oCanvas, iWidth, iHeight) {
        if (iWidth && iHeight) {
            var oSaveCanvas = document.createElement("canvas");
            oSaveCanvas.width = iWidth;
            oSaveCanvas.height = iHeight;
            oSaveCanvas.style.width = iWidth+"px";
            oSaveCanvas.style.height = iHeight+"px";

            var oSaveCtx = oSaveCanvas.getContext("2d");

            oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
            return oSaveCanvas;
        }
        return oCanvas;
    };

    /** 
	 * Return the image data of a resized canvas
	 *
	 * @param oCanvas, the canvas you want to resize
	 * @param iWidth, the integer new width size
	 * @param iWidth, the integer new height size
	 */
    hackenbush.controller.saveAsPNG = function(oCanvas, iWidth, iHeight) {
        var oScaledCanvas = hackenbush.controller.scaleCanvas(oCanvas, iWidth, iHeight);
        var strData = oScaledCanvas.toDataURL("image/png");
        return strData;
    };
})();
