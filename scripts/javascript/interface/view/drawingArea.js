(function(){

    var canvas = $("#canvasArea");
    var context = canvas[0].getContext('2d');
    var width = canvas[0].width;
    var height = canvas[0].height;
    
    
    /* VAR */
    hackenbush.views.drawingArea.graphUi = new HackenbushGraph();
    hackenbush.views.drawingArea.graphUi.nodeIdCounter = 0;
    hackenbush.views.drawingArea.dash = new HackenbushGraph();
    hackenbush.views.drawingArea.canvas = canvas;
    hackenbush.views.drawingArea.context = context;
    hackenbush.views.drawingArea.imageData = context.getImageData(0, 0, width, height); 
    
    hackenbush.views.drawingArea.nodeRadius = 8;
    hackenbush.views.drawingArea.nodeFillColor = "white";
    hackenbush.views.drawingArea.nodeBorderColor = "black";
    hackenbush.views.drawingArea.nodeBorderWidth = 1;
        
    hackenbush.views.drawingArea.controlPRadius = 6;
    hackenbush.views.drawingArea.controlPFillColor = "#FBF2F2";
    hackenbush.views.drawingArea.controlPBorderWidth = 1;
    
    hackenbush.views.drawingArea.bezierCurveWidth = 3;
    
    hackenbush.views.drawingArea.currentNodeId = 0;
    hackenbush.views.drawingArea.mouseoverNode = null;
    hackenbush.views.drawingArea.mouseoverEdge = null;
    hackenbush.views.drawingArea.selectedEdge = null;
    hackenbush.views.drawingArea.selectedControlPoint = null;
    
    hackenbush.views.drawingArea.grassHeight = 30;
    
    
    
    
    /* METHODS */
    
    /**
     * keep the view synchronized with the other views
     * 
     * @param action : a string value refering to the action to perform
     * @param args : an array of arguments to given for the action
     **/
    hackenbush.views.drawingArea.selfSynchronize = function(action, args) {
        
    }
    
    /**
     * draw a node in the canvas.
     * 
     * @param point : a 2D Point  
     */
    hackenbush.views.drawingArea.drawNode = function(point){
        
        var context = hackenbush.views.drawingArea.context;
        context.lineWidth = hackenbush.views.drawingArea.nodeBorderWidth;
        context.strokeStyle = hackenbush.views.drawingArea.nodeBorderColor;
        context.fillStyle = hackenbush.views.drawingArea.nodeFillColor;
            
        context.beginPath();
        context.arc(point.x, point.y, hackenbush.views.drawingArea.nodeRadius, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        context.closePath();
    }
        
    /**
     * draw a node with shadow in the canvas(using drawNode).
     * 
     * @param point : a 2D Point  
     */    
    hackenbush.views.drawingArea.drawShadowNode = function(point){
        var context = hackenbush.views.drawingArea.context;
        context.shadowColor = "black";
        context.shadowBlur = 15;
        hackenbush.views.drawingArea.drawNode(point);
        context.shadowBlur = 0;
    }
    
    /**
     * draw a control point in the canvas.
     * 
     * @param point : a 2D Point
     * @param borderColor : a string representing the color in hexadecimal.  
     */
    hackenbush.views.drawingArea.drawControlPoint = function(point, borderColor) {
        var context = hackenbush.views.drawingArea.context;
        context.lineWidth = hackenbush.views.drawingArea.controlPBorderWidth;
        context.strokeStyle = borderColor;
        context.fillStyle = hackenbush.views.drawingArea.controlPFillColor;    
        context.beginPath();
        context.arc(point.x, point.y, hackenbush.views.drawingArea.controlPRadius, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        context.closePath();
    }
    
    /**
     * draw a line between two points in the canvas.
     * 
     * @param start: 2D Point
     * @param goal : 2D Point  
     */
    hackenbush.views.drawingArea.drawLine = function (start, goal) { 
        var context = hackenbush.views.drawingArea.context;
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.globalAlpha = 0.2;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(goal.x, goal.y);
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;
    }
    
    /**
     * draw a beziercurve in the canvas.
     * 
     * @param bezierCurve : a BezierCurve object containing 4 control points.
     * @param alpha : the alpha of the bezier curve.
     * @param showControlPoint : a boolean (true ==> show the control points || false ==> do not show the control points) 
     */
    hackenbush.views.drawingArea.drawBezierCurve = function(bezierCurve, alpha, showControlPoint){
        var start, goal;
        if(hackenbush.views.drawingArea.dash.nodeExists(bezierCurve.startId)) start = hackenbush.views.drawingArea.dash.getNodeValue(bezierCurve.startId);
        else start = hackenbush.views.drawingArea.graphUi.getNodeValue(bezierCurve.startId);
        if(hackenbush.views.drawingArea.dash.nodeExists(bezierCurve.goalId)) goal = hackenbush.views.drawingArea.dash.getNodeValue(bezierCurve.goalId);
        else goal = hackenbush.views.drawingArea.graphUi.getNodeValue(bezierCurve.goalId);
        
        var context = hackenbush.views.drawingArea.context;
        context.lineWidth = hackenbush.views.drawingArea.bezierCurveWidth;
        context.strokeStyle = bezierCurve.color;
        context.globalAlpha = alpha;
            
        context.beginPath();
        context.moveTo(start.x, start.y); 
        context.bezierCurveTo(bezierCurve.controlP1.x, bezierCurve.controlP1.y, bezierCurve.controlP2.x , bezierCurve.controlP2.y, goal.x + 0.01, goal.y + 0.01);
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;
        if(showControlPoint){
            hackenbush.views.drawingArea.drawLine(start, bezierCurve.controlP1);
            hackenbush.views.drawingArea.drawLine(goal, bezierCurve.controlP2);
        }
        hackenbush.views.drawingArea.drawNode(start);
        hackenbush.views.drawingArea.drawNode(goal);
        if(showControlPoint){
            hackenbush.views.drawingArea.drawControlPoint(bezierCurve.controlP1, bezierCurve.color);
            hackenbush.views.drawingArea.drawControlPoint(bezierCurve.controlP2, bezierCurve.color);
        }
        
    }
    
    /**
     * draw a beziercurve with shadow in the canvas (using drawBezierCurve).
     * 
     * @param bezierCurve : a BezierCurve object containing 4 control points.
     * @param alpha : the alpha of the bezier curve.
     * @param showControlPoint : a boolean (true ==> show the control points || false ==> do not show the control points) 
     */
    hackenbush.views.drawingArea.drawShadowBezierCurve = function(bezierCurve, alpha, showControlPoint){
        var context = hackenbush.views.drawingArea.context;
        context.shadowColor = bezierCurve.color;
        context.shadowBlur = 10;
        hackenbush.views.drawingArea.drawBezierCurve(bezierCurve, alpha, showControlPoint);
        context.shadowBlur = 0;
    }
    
 
    /**
     * draw the ground.
     */
    hackenbush.views.drawingArea.drawGrass = function() {
        var context = hackenbush.views.drawingArea.context;
        context.beginPath();
        context.fillStyle = '#00ff00';
        context.shadowColor = '#00ff00';
        context.shadowBlur = 30;
        context.fillRect(0,height-hackenbush.views.drawingArea.grassHeight,width,hackenbush.views.drawingArea.grassHeight);
        context.closePath();
        context.shadowColor = 'black';
        context.shadowBlur = 0;
        hackenbush.views.drawingArea.imageData = context.getImageData(0, 0, width, height);
    }
    
    /**
     * refreshs the canvas while mousemove is detected and the user edit the drawing area.
     */
    hackenbush.views.drawingArea.refresh = function() {
        hackenbush.views.drawingArea.context.putImageData(hackenbush.views.drawingArea.imageData, 0, 0);
            
        var point, alpha;
        if(hackenbush.views.drawingArea.currentNodeId){
            point = hackenbush.views.drawingArea.dash.getNodeValue(hackenbush.views.drawingArea.currentNodeId);
            hackenbush.views.drawingArea.drawShadowNode(point);
            hackenbush.views.drawingArea.cursorIsOver();
        }
        else if(hackenbush.views.drawingArea.mouseoverNode){
            point = hackenbush.views.drawingArea.mouseoverNode.weight;
            hackenbush.views.drawingArea.drawShadowNode(point);
            hackenbush.views.drawingArea.cursorIsOver();
        }
        else hackenbush.views.drawingArea.setCursor(hackenbush.views.drawingArea.tool);
        
        if(hackenbush.views.drawingArea.mouseoverEdge) {
            hackenbush.views.drawingArea.drawShadowBezierCurve(hackenbush.views.drawingArea.mouseoverEdge.weight, 1, false);
            hackenbush.views.drawingArea.cursorIsOver();
        }
        
        if(hackenbush.views.drawingArea.selectedControlPoint) hackenbush.views.drawingArea.cursorIsOver();
        
        for (var itemKey in hackenbush.views.drawingArea.dash.nodes){
            var node = hackenbush.views.drawingArea.dash.nodes[itemKey];
            var start = node.weight;
                
            for(var neighborKey in node.neighbors){
                var goal = hackenbush.views.drawingArea.dash.nodes[neighborKey].weight;
                var edges = node.neighbors[neighborKey];
                    
                for(var i = 0; i < edges.length; i++){
                    var bezierCurve = edges[i].weight;
                    alpha = 0.3;
                    if(hackenbush.views.drawingArea.graphUi.linkedToGround[itemKey]) alpha = 1;
                    hackenbush.views.drawingArea.drawBezierCurve(bezierCurve, alpha, false);
                }                   
            }
        }
        if(hackenbush.views.drawingArea.selectedEdge) hackenbush.views.drawingArea.drawShadowBezierCurve(hackenbush.views.drawingArea.selectedEdge.weight, 1, true);
    }
        
        
    /**
     * updates the canvas when mouseup is detected and the user has changed something.
     */    
    hackenbush.views.drawingArea.update = function(showSelectedEdge){            
        hackenbush.views.drawingArea.reset();
        for (var itemKey in hackenbush.views.drawingArea.graphUi.nodes){
            var node = hackenbush.views.drawingArea.graphUi.nodes[itemKey];              
                
            for(var neighborKey in node.neighbors){
                var edges = node.neighbors[neighborKey];
                    
                for(var i = 0; i < edges.length; i++){
                    var startId = itemKey.replace('#','')*1;
                    var goalId = neighborKey.replace('#','')*1;
                    var selectedEdgeId; 
                    if(hackenbush.views.drawingArea.selectedEdge) selectedEdgeId = hackenbush.views.drawingArea.selectedEdge.id;
                    if(edges[i].id !== selectedEdgeId && startId !== hackenbush.views.drawingArea.currentNodeId && goalId !==hackenbush.views.drawingArea.currentNodeId){
                        var beizerCurve = edges[i].weight;
                        var alpha = 0.3;
                        if(hackenbush.views.drawingArea.graphUi.linkedToGround[itemKey]) alpha = 1;
                        hackenbush.views.drawingArea.drawBezierCurve(beizerCurve, alpha, false);
                    }
                }
            }
                    
        }
        if(hackenbush.views.drawingArea.selectedEdge  && showSelectedEdge) hackenbush.views.drawingArea.drawShadowBezierCurve(hackenbush.views.drawingArea.selectedEdge.weight, 1, true);
        hackenbush.views.drawingArea.imageData = hackenbush.views.drawingArea.context.getImageData(0, 0, width, height);
    }
    

    /**
     * set the cursor while the mouse is over the canvas.
     * 
     * @param tool : a string refering to the current tool used.
     */
    hackenbush.views.drawingArea.setCursor = function(tool) {
        if (tool === "draw") canvas.css("cursor", "crosshair");
        else if(tool === "erase") canvas.css("cursor", "url('./ressources/images/cursor-scissors.png'), pointer");
        else if(tool === "edit") canvas.css("cursor", "pointer");
        else if (tool === "selected") canvas.css("cursor", "move");
    }

    
    hackenbush.views.drawingArea.elementSelected = function(tool) {
        var elementTool = $('#'+tool);
        var prevElementTool = $('#main-left .hideInPlay.locked');
        if (prevElementTool.hasClass('locked')) {
            prevElementTool.addClass('button');
            prevElementTool.addClass('toolChooser');
            prevElementTool.removeClass('locked');
        }
        elementTool.removeClass('button');
        elementTool.removeClass('toolChooser');
        elementTool.addClass('locked');
    }
    
    /**
     * modify the cursor when it is over a node, a bezier curve or a control point, in the canvas. 
     */    
    hackenbush.views.drawingArea.cursorIsOver = function() {
        if (hackenbush.views.drawingArea.tool === "edit" ) hackenbush.views.drawingArea.setCursor('selected');
        if (hackenbush.views.drawingArea.tool === "erase") canvas.css("cursor", "url('./ressources/images/cursor-scissors-active.png'), not-allowed");
    }
    
    /**
     * reset the canvas to it initial state.
     */
    hackenbush.views.drawingArea.reset = function(){
        var context = hackenbush.views.drawingArea.context;
        context.clearRect(0, 0, width, height);
        hackenbush.views.drawingArea.drawGrass();
    }
    
    
    hackenbush.views.drawingArea.drawGrass();
})();
