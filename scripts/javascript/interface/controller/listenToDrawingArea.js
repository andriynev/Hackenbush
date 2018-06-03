(function(){
    /* VAR */
    var canvas = $("#canvasArea");
    var width = canvas[0].width;
    var height = canvas[0].height;
    
    
    /* METHODS */
    
    /**
     *checks if the position match the ground
     *
     *@param x : x-coordonate
     *@param y : y-coordonate
     *
     *@return true if the position match the ground. False otherwise.
     **/
    hackenbush.views.drawingArea.isOnGrass = function(x, y){
        if(y+hackenbush.views.drawingArea.nodeRadius >= height - hackenbush.views.drawingArea.grassHeight) return true;
        return false;
    }
    
    
    /**
     * returns the control point overflowed by the mouse 
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     * 
     * @return a Point refering to the control point overflowed. null if neither is selected
     **/
    hackenbush.views.drawingArea.getControlPointByCoord = function(x, y) {
        function match(controlPoint){
            if(x >= controlPoint.x - hackenbush.views.drawingArea.nodeRadius && x <= controlPoint.x + hackenbush.views.drawingArea.nodeRadius && y >= controlPoint.y - hackenbush.views.drawingArea.nodeRadius && y <= controlPoint.y + hackenbush.views.drawingArea.nodeRadius)
                return true;
            return false;
        }
        var point = null;
        if(hackenbush.views.drawingArea.selectedEdge){
            var controlP1 = hackenbush.views.drawingArea.selectedEdge.weight.controlP1;
            if(match(controlP1)) point = controlP1;
            var controlP2 = hackenbush.views.drawingArea.selectedEdge.weight.controlP2;
            if(match(controlP2))  point = controlP2;
        }
        return point;
    }
    
    
    /**
     * returns the node overflowed by the mouse
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     * 
     * @return a Point refering to the node overflowed. null if neither is selected
     **/
    hackenbush.views.drawingArea.getNodeByCoord = function(x, y) {
        var radius = hackenbush.views.drawingArea.nodeRadius;
        var distance = 2*radius;
        for(var itemKey in hackenbush.views.drawingArea.graphUi.nodes){
            var item = hackenbush.views.drawingArea.graphUi.nodes[itemKey].weight;
            if(x >= item.x - distance && x <= item.x + distance && y >= item.y - distance && y <= item.y + distance) return itemKey.replace('#', '')*1;
        }
        return 0;          
    }
    
    
    /**
     * returns the edge overflowed by the mouse
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     * 
     * @return the edge overflowed. null if neither is selected
     **/
    hackenbush.views.drawingArea.getEdgeByCoord = function(x, y) {
        
        function match(bezierCurve){
            var start = hackenbush.views.drawingArea.graphUi.getNodeValue(bezierCurve.startId);
            var goal = hackenbush.views.drawingArea.graphUi.getNodeValue(bezierCurve.goalId);
            var X0 = start.x;
            var Y0 = start.y;
            var X1 = bezierCurve.controlP1.x;
            var Y1 = bezierCurve.controlP1.y;
            var X2 = bezierCurve.controlP2.x;
            var Y2 = bezierCurve.controlP2.y;
            var X3 = goal.x;
            var Y3 = goal.y;
            var t, X, Y;
            var radius = hackenbush.views.drawingArea.bezierCurveWidth*2;
            var step = 100;
            hackenbush.views.drawingArea.context.beginPath();
            hackenbush.views.drawingArea.strokeStyle = "black";
            hackenbush.views.drawingArea.context.fillStyle = "blue";
            hackenbush.views.drawingArea.context.arc(x, y, radius, 0, 2 * Math.PI);
            hackenbush.views.drawingArea.context.stroke();
            hackenbush.views.drawingArea.context.fill();
            for(var i = 0; i < step; i++) {
                t = i/step;
                X = X0*Math.pow(1 - t, 3) + 3*X1*t*Math.pow(1-t, 2) + 3*X2*Math.pow(t, 2)*(1-t) + X3*Math.pow(t, 3);
                Y = Y0*Math.pow(1 - t, 3) + 3*Y1*t*Math.pow(1-t, 2) + 3*Y2*Math.pow(t, 2)*(1-t) + Y3*Math.pow(t, 3);
                if(x >= X - radius && x <= X + radius && y <= Y + 3*radius && y >= Y - radius)return true;
            }
            return false;
        }
        var visitedEdges = new Object();
        
        for (var nodeKey in hackenbush.views.drawingArea.graphUi.nodes) {
            var startId = nodeKey.replace('#','')*1;
            var startNode = hackenbush.views.drawingArea.graphUi.getNodeById(startId);
            
            for(var neighborKey in startNode.neighbors) {
                var edges = startNode.neighbors[neighborKey];
                for(var i = 0; i < edges.length; i++){
                    if(!visitedEdges['#'+edges[i].id]){
                        visitedEdges['#'+edges[i].id] = true;
                        if(match(edges[i].weight))
                            return edges[i];
                    }
                }
            }
        }
        return null;
    }
    
    
    /**
     * detects items on the canvas which are selected by the user (performed at mousedown)
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     **/
    hackenbush.views.drawingArea.setSelectedItem = function(x, y){
        
        hackenbush.views.drawingArea.selectedControlPoint = hackenbush.views.drawingArea.getControlPointByCoord(x, y);
        if(!hackenbush.views.drawingArea.slectedControlPoint){ 
            var id = hackenbush.views.drawingArea.getNodeByCoord(x, y);
            if(id){
                hackenbush.views.drawingArea.currentNodeId = id;
                var node = hackenbush.views.drawingArea.graphUi.getNodeById(id);
                hackenbush.views.drawingArea.dash.addWeightedNode(id, node.weight);
                
                for(var itemKey in node.neighbors) {
                    var neighborId = itemKey.replace("#", '')*1;
                    if(!hackenbush.views.drawingArea.dash.nodeExists(neighborId)) {
                        var point = hackenbush.views.drawingArea.graphUi.getNodeValue(neighborId);
                        hackenbush.views.drawingArea.dash.addWeightedNode(neighborId, point);  
                    }
                }
                for(itemKey in node.neighbors) {
                    neighborId = itemKey.replace("#", '')*1;
                    var edges = node.neighbors[itemKey];
                    for(var i = 0; i < edges.length; i++) {
                        var bezierCurve = hackenbush.views.drawingArea.graphUi.getEdgeValue(id, neighborId, i);
                        hackenbush.views.drawingArea.dash.addWeightedEdge(id, neighborId, bezierCurve);
                    }
                }
            }
            else{
                var edge = hackenbush.views.drawingArea.getEdgeByCoord(x, y); 
                if(edge)hackenbush.views.drawingArea.selectedEdge = edge;
            }
        }
        hackenbush.views.drawingArea.update(false);
        hackenbush.views.drawingArea.refresh();
    }
    
    
    /**
     * kind of mouseover event, performed while mousemove, that detects if the mouse overflow any element on the canvas.
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     **/
    hackenbush.views.drawingArea.mouseOverSomething = function(x, y, isPlaying){
        var id = hackenbush.views.drawingArea.getNodeByCoord(x, y);
        if(id) {
            hackenbush.views.drawingArea.mouseoverNode = hackenbush.views.drawingArea.graphUi.getNodeById(id);
        }
        else{
            hackenbush.views.drawingArea.mouseoverNode = null;
            hackenbush.views.drawingArea.mouseoverEdge = hackenbush.views.drawingArea.getEdgeByCoord(x, y);
            if(isPlaying && hackenbush.views.drawingArea.mouseoverEdge){
                var start = hackenbush.views.drawingArea.mouseoverEdge.weight.startId;
                var goal = hackenbush.views.drawingArea.mouseoverEdge.weight.goalId;
                var edgeId = hackenbush.views.drawingArea.mouseoverEdge.id;
                var edgeIndex = hackenbush.views.drawingArea.graphUi.getEdgeIndexByIds(start, goal, edgeId);
                var color = hackenbush.controller.playerColors.indexOf(hackenbush.views.drawingArea.graphUi.getEdgeValue(start, goal, edgeIndex).color);
                if(color !== -1 && color !== hackenbush.controller.currentPlayer){
                    hackenbush.views.drawingArea.mouseoverEdge = null;
                }
            }
            
            
            hackenbush.views.drawingArea.selectedControlPoint = hackenbush.views.drawingArea.getControlPointByCoord(x, y);
        }
        hackenbush.views.drawingArea.refresh();
    }
    
    
    /**
     * adds a node to the drawing area
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     * 
     **/
    hackenbush.views.drawingArea.addNode = function(x, y) {
        if(hackenbush.views.drawingArea.isOnGrass(x,y)) y = height-hackenbush.views.drawingArea.grassHeight;
            
        var point;
        var id = hackenbush.views.drawingArea.getNodeByCoord(x, y);
            
        if(id) point = hackenbush.views.drawingArea.graphUi.getNodeValue(id);
            
        else{
            id = ++hackenbush.views.drawingArea.graphUi.nodeIdCounter;                
            point = new Point( x, y);
            hackenbush.views.drawingArea.graphUi.addWeightedNode(id, point);
            if(hackenbush.views.drawingArea.isOnGrass(x,y)) hackenbush.views.drawingArea.graphUi.groundNode(id);
        }
        hackenbush.views.drawingArea.dash.addWeightedNode(id, point);
        hackenbush.views.drawingArea.currentNodeId = id;
            
        hackenbush.views.drawingArea.refresh();
    }
    
    
    /**
     * moves a node on the canvas without changing it position in the view model.(performed while [mousemove+mousedown] ) (using dash model)
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     **/
    hackenbush.views.drawingArea.move = function(x, y){
        
        if(hackenbush.views.drawingArea.selectedControlPoint){
            hackenbush.views.drawingArea.selectedControlPoint.x = x;
            hackenbush.views.drawingArea.selectedControlPoint.y = y;
        }
        else if(hackenbush.views.drawingArea.currentNodeId){
            var point;  
            if(hackenbush.views.drawingArea.isOnGrass(x,y)) y = height - hackenbush.views.drawingArea.grassHeight;
                
            var id = hackenbush.views.drawingArea.getNodeByCoord(x, y);
            if(id && id !== hackenbush.views.drawingArea.currentNodeId) {
                var coord = hackenbush.views.drawingArea.graphUi.getNodeValue(id);
                point = new Point(coord.x, coord.y);
            }
            else{
                point = new Point(x, y);
            }
            hackenbush.views.drawingArea.dash.setNodeValue(hackenbush.views.drawingArea.currentNodeId, point);
        }
        hackenbush.views.drawingArea.refresh();
    }
    
    
    /**
     * draws a stem composed by an edge connecting two nodes.(performed while [mousemove+mousedown]) (using dash model)
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse) 
     * @param color : the edge color
     **/
    hackenbush.views.drawingArea.draw = function(x, y, color){
                        
        if(hackenbush.views.drawingArea.isOnGrass(x,y)) y = height - hackenbush.views.drawingArea.grassHeight;
            
        var id = hackenbush.views.drawingArea.getNodeByCoord(x, y);
            
        if(id){
            var item = hackenbush.views.drawingArea.graphUi.getNodeValue(id);
            x = item.x;
            y = item.y;   
        }
            
        id = hackenbush.views.drawingArea.graphUi.nodeIdCounter + 42;
        var goal = new Point(x, y);
            
        var startPoint = hackenbush.views.drawingArea.graphUi.getNodeValue(hackenbush.views.drawingArea.currentNodeId);
        var averageX = (x + startPoint.x)/2;
        var averageY = (y + startPoint.y)/2;
        var orientationP1 = new Point(averageX, averageY);
        var orientationP2 = new Point(averageX, averageY);
        var bezierCurve = new BezierCurve(hackenbush.views.drawingArea.currentNodeId, orientationP1, orientationP2, id, color)
                
        if(!hackenbush.views.drawingArea.dash.nodeExists(id)) {
            hackenbush.views.drawingArea.dash.addWeightedNode(id, goal);
            hackenbush.views.drawingArea.dash.addWeightedEdge(hackenbush.views.drawingArea.currentNodeId, id, bezierCurve);
        }
        else{
            hackenbush.views.drawingArea.dash.setNodeValue(id, goal);
            hackenbush.views.drawingArea.dash.setEdgeValue(hackenbush.views.drawingArea.currentNodeId, id, 0, bezierCurve);
        }
                
        hackenbush.views.drawingArea.refresh();
    }
        
    /**
     * adds an edge to the view model using the dash model modifyed by the user.(using view model) (perfomred at mouseup)
     **/    
    hackenbush.views.drawingArea.addEdge = function() {
            
        var dashId = hackenbush.views.drawingArea.graphUi.nodeIdCounter + 42;
        var startId = hackenbush.views.drawingArea.currentNodeId;
            
        if(hackenbush.views.drawingArea.dash.nodeExists(dashId)){
                
            var indexEdge = hackenbush.views.drawingArea.dash.getNodeById(startId).neighbors["#"+dashId].length - 1;
            var color = hackenbush.views.drawingArea.dash.getEdgeValue(startId, dashId, indexEdge).color;
                
            var point = hackenbush.views.drawingArea.dash.getNodeValue(dashId);
            var id = hackenbush.views.drawingArea.getNodeByCoord(point.x, point.y);
                
            if(!id) {
                hackenbush.views.drawingArea.addNode(point.x, point.y);
                id = hackenbush.views.drawingArea.graphUi.nodeIdCounter;
            }
            var start = hackenbush.views.drawingArea.graphUi.getNodeValue(startId);
            var goal = hackenbush.views.drawingArea.graphUi.getNodeValue(id);
            var averageX = (start.x + goal.x)/2;
            var averageY = (start.y + goal.y)/2;
            var bezierCurve = new BezierCurve(startId, new Point(averageX, averageY), new Point(averageX, averageY), id, color);
                
            hackenbush.views.drawingArea.graphUi.addWeightedEdge(startId, id, bezierCurve); 
        }
            
    }
    

    /**
     * applys the changes ordered by the user (using view model) (performed at mouseup)
     **/
    hackenbush.views.drawingArea.saveChanges = function(){
        //FUNCTIONS
        function searchDuplicate(currentNodeId){
                
            var currentPoint = hackenbush.views.drawingArea.dash.getNodeValue(currentNodeId);
                
            for(var itemKey in hackenbush.views.drawingArea.graphUi.nodes){
                var id = itemKey.replace('#', '')*1;
                var point = hackenbush.views.drawingArea.graphUi.getNodeValue(id);
                if(id !== currentNodeId && currentPoint.x === point.x && currentPoint.y === point.y)return id;
            }
            return 0;
        }            
        function mergeNodes(oldId, id){
            var oldNode = hackenbush.views.drawingArea.graphUi.getNodeById(oldId);
                
            for(var neighborKey in oldNode.neighbors){
                var neighborId = neighborKey.replace('#', '')*1;
                var edges = oldNode.neighbors[neighborKey];
                for(var i = 0; i < edges.length; i++){
                    var weight = edges[i].weight;
                    if(edges[i].weight.startId === oldId) edges[i].weight.startId = id;
                    if(edges[i].weight.goalId === oldId) edges[i].weight.goalId = id;
                    hackenbush.views.drawingArea.graphUi.addWeightedEdge(id, neighborId, weight);
                }
            }
            hackenbush.views.drawingArea.graphUi.removeNode(oldId);
        }
        //ALGORITHM
        var currentNodeId = hackenbush.views.drawingArea.currentNodeId;
        if(currentNodeId){
                
            var currentPoint = hackenbush.views.drawingArea.dash.getNodeValue(currentNodeId);
            hackenbush.views.drawingArea.graphUi.setNodeValue(currentNodeId, currentPoint);
            var id = searchDuplicate(currentNodeId);
            var point = hackenbush.views.drawingArea.graphUi.getNodeValue(currentNodeId);
            if (id) mergeNodes(currentNodeId, id);
                
            else if (hackenbush.views.drawingArea.isOnGrass(point.x, point.y) && !hackenbush.views.drawingArea.graphUi.isAlreadyGrounded(currentNodeId)){
                hackenbush.views.drawingArea.graphUi.groundNode(currentNodeId);
            }
                
            else if (!hackenbush.views.drawingArea.isOnGrass(point.x, point.y) &&  hackenbush.views.drawingArea.graphUi.isAlreadyGrounded(currentNodeId)) 
                hackenbush.views.drawingArea.graphUi.unGroundNode(currentNodeId);
        }
    }
        
        
    /**
     * cuts a stem. If the user uses editing mode, he can cut every stem. If he uses playing mode, he cans only cut stem from his color.
     * 
     * @param x : x-coordonate (mouse)
     * @param y : y-coordonate (mouse)
     * @param isPlaying : true if the user is playing, false otherwise.
     **/    
    hackenbush.views.drawingArea.erase = function(x, y, isPlaying){
        var edge = hackenbush.views.drawingArea.getEdgeByCoord(x, y);
        if(edge) {
            var startId = edge.weight.startId;
            var goalId = edge.weight.goalId;
            var edgeId = edge.id;
            if(isPlaying){
                var edgeIndex = hackenbush.views.drawingArea.graphUi.getEdgeIndexByIds(startId, goalId, edgeId);
                var color = hackenbush.modele.graphGame.getEdgeValue(startId, goalId, edgeIndex);
                if(color === 2 || color === hackenbush.controller.currentPlayer){
                    hackenbush.views.drawingArea.graphUi.removeEdgeByIds(startId, goalId, edgeId);
                    hackenbush.views.drawingArea.graphUi.removeFlyingNodes();
                    hackenbush.controller.erase(startId, goalId, edgeIndex);
                }
            }
            else{
                hackenbush.views.drawingArea.graphUi.removeEdgeByIds(startId, goalId, edgeId);
            }
        }
        hackenbush.views.drawingArea.update();
    }
        
        
    /**
     * reinitializes the dash and apply some rules(like remove lonely nodes)
     **/    
    hackenbush.views.drawingArea.apply = function(){
        hackenbush.views.drawingArea.dash = new HackenbushGraph();
        hackenbush.views.drawingArea.currentNodeId = 0;
        hackenbush.views.drawingArea.mouseoverNode = null;
        hackenbush.views.drawingArea.mouseoverEdge = null;
        hackenbush.views.drawingArea.selectedControlPoint = null;
        hackenbush.views.drawingArea.graphUi.removeLonelyNodes();
        hackenbush.views.drawingArea.update(true);
    }
        
    /**
     * reinitializes all the drawing area removing every drawing.
     **/    
    hackenbush.views.drawingArea.eraseAll = function() {
        hackenbush.views.drawingArea.selectedEdge = null;
        hackenbush.views.drawingArea.graphUi = new HackenbushGraph();
        hackenbush.views.drawingArea.graphUi.nodeIdCounter = 0;
        hackenbush.views.drawingArea.dash = new HackenbushGraph();
        hackenbush.views.drawingArea.update(true);
    }

    /**
     * reinitializes all the drawing area removing every drawing and unlock differents buttons.
     **/    
    hackenbush.views.drawingArea.resetGame = function() {
        hackenbush.views.drawingArea.eraseAll();
        hackenbush.views.page.loadPage("play");
    }

    /**
     * builds the graph game
     **/
    hackenbush.views.drawingArea.buildGraphGame = function(){
        var alreadyVisitedEdge = new Array(); 
        var graph = new HackenbushGraph();
        hackenbush.views.drawingArea.graphUi.removeFlyingNodes();
        for(var nodeKey in hackenbush.views.drawingArea.graphUi.nodes) {
            var id = nodeKey.replace('#','')*1;
            graph.addNode(id);
        }
        for(nodeKey in hackenbush.views.drawingArea.graphUi.nodes) {
            id = nodeKey.replace('#','')*1;
            var neighbors = hackenbush.views.drawingArea.graphUi.getNodeById(id).neighbors;
            
            for(var neighborKey in neighbors){
                var destId = neighborKey.replace('#','')*1;
                var edges = neighbors[neighborKey];
                
                for(var i = 0; i < edges.length; i++){
                    var edgeId = hackenbush.views.drawingArea.graphUi.nodes[nodeKey].neighbors[neighborKey][i].id;
                    if(!alreadyVisitedEdge['#'+edgeId]){
                        alreadyVisitedEdge['#'+edgeId] = true;
                        var color = hackenbush.controller.playerColors.indexOf(edges[i].weight.color); 
                        if (color === -1) color = 2;
                        graph.addWeightedEdge(id, destId, color);
                    }
                }
            }
        }
        graph.groundedNodes = hackenbush.views.drawingArea.graphUi.groundedNodes.slice(0, hackenbush.views.drawingArea.graphUi.getGroundedNodesCount());
        hackenbush.controller.buildGraphGame(graph);
    }
    
    
    /**
     * adds necessary listeners to the drawing area 
     **/
    hackenbush.views.drawingArea.listenToDrawingArea = function() {
        
        var mousedown = false;
        
        var getMouseCoords = function (event){
            var canvasOffset = canvas.offset();
            var currentX = Math.floor(event.pageX - canvasOffset.left);
            var currentY = Math.floor(event.pageY - canvasOffset.top);
            return {
                x: currentX, 
                y: currentY
            };	
        };
        
        var Xtolerance = parseFloat(canvas.css("border-left-width"))+parseFloat(canvas.css("border-right-width")); // outerWidth isn't trustworthy
        var Ytolerance = parseFloat(canvas.css("border-top-width"))+parseFloat(canvas.css("border-bottom-width"));

        canvas.bind("mousedown",  function(event) {
            
            mousedown = true;
            var startCoords = getMouseCoords(event);  
            //taking care of the border width
            if(startCoords.x > canvas[0].width - Xtolerance || startCoords.x < Xtolerance || startCoords.y > canvas[0].height - Ytolerance || startCoords.y < Ytolerance) return
            
            if(hackenbush.views.drawingArea.tool === "draw") hackenbush.views.drawingArea.addNode(startCoords.x, startCoords.y);
            else if(hackenbush.views.drawingArea.tool === "erase") hackenbush.views.drawingArea.erase(startCoords.x, startCoords.y, hackenbush.controller.isPlaying);
            else if(hackenbush.views.drawingArea.tool === "edit") hackenbush.views.drawingArea.setSelectedItem(startCoords.x, startCoords.y);
            
            
        });
        
        canvas.bind("mousemove", function(event) {
            var canvasCoords =  getMouseCoords(event);  
            
            if(mousedown){
                if(canvasCoords.x > canvas[0].width - Xtolerance || canvasCoords.x < Xtolerance || canvasCoords.y > canvas[0].height - Ytolerance || canvasCoords.y < Ytolerance) return
                if(hackenbush.views.drawingArea.tool === "draw") hackenbush.views.drawingArea.draw(canvasCoords.x, canvasCoords.y, hackenbush.views.drawingArea.color);
                if(hackenbush.views.drawingArea.tool === "edit") hackenbush.views.drawingArea.move(canvasCoords.x, canvasCoords.y);
             
            }
            else  hackenbush.views.drawingArea.mouseOverSomething(canvasCoords.x, canvasCoords.y, hackenbush.controller.isPlaying);
        });
        
        
        $('body').bind("mouseup", function(event){
            mousedown = false;
            
            if(hackenbush.views.drawingArea.tool === "draw") hackenbush.views.drawingArea.addEdge();
            else if(hackenbush.views.drawingArea.tool === "edit") hackenbush.views.drawingArea.saveChanges();
            hackenbush.views.drawingArea.apply(); 
        });
    }     
    hackenbush.controller.listenToDrawingArea = function(){
        canvas.bind("mousedown",function(event){
            if(hackenbush.controller.isPlaying){
                if(hackenbush.controller.turnPlayed){
                    hackenbush.controller.applyRules();
                }
            }
        });
    }
    
    
    /**
     * Stop listening to the canvas
     **/
    hackenbush.controller.unbindDrawingArea = function(){
        canvas.unbind("mousedown");
        canvas.unbind("mousemove");
        $("body").unbind("mouseup");
        canvas.unbind("click");
        hackenbush.controller.canvasUnbinded = true;
    }
    
    
    hackenbush.views.drawingArea.listenToDrawingArea(); 
    hackenbush.controller.listenToDrawingArea();
})();
