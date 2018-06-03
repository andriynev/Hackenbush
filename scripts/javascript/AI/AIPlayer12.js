(function(){
    
    window.AIPlayer12 = function(){
       
        // INHERITENCE
       
        AbstractAIPlayer.call(this);
    
    
        // MEMBERS
        
        this.start = null;
        this.timeout = 800;// time in ms
    
    
        //METHODS
        
        
        /**
         * check the time to respect the 1000ms restriction
         * 
         * @return : true if the time is out, false otherwise
         **/
        this.timeIsOut = function(){
            if(new Date().valueOf() - this.start.valueOf() > this.timeout) return true;
            else return false;
        }
        
        /**
         * return the first edge removable by the current player (about 1ms to perform on a random graph returned by the Mr Soulignac's method and our graph type)
         *
         *@param hbg : the graph representing the game
         *@param color : the color of the current player (type: integer, no particular constraint on value)
         *
         *@return the first edge removable by the current player
         *
         **/
        this.quickestMove = function(hbg, color){
            
            var move = null;
            
            var groundedNodesCount = hbg.getGroundedNodesCount();
            var queue = new Array();
            var rank = new Array();
            
            //adding grounded nodes to the queue.
            for(var i = 1; i <= groundedNodesCount; i++){
                var currentNodeId = hbg.getGroundedNode(i);
                queue.push(currentNodeId);
                rank["#"+currentNodeId] = 1;
            }
            
            //dequeue the queueconsole.log(releventMove);
            while(queue.length > 0){

                currentNodeId = queue.shift();
                var neighborhoodSize = hbg.getNeighborhoodSize(currentNodeId);
                
                for(i = 1; i <= neighborhoodSize; i++){
                   
                    var currentNeighborId = hbg.getNeighbor(currentNodeId, i);
                   
                    if(!rank["#"+currentNeighborId]){
                        queue.push(currentNeighborId);
                        rank["#"+currentNeighborId] = rank["#"+currentNodeId]+1;
                    }
                    
                    if(rank["#"+currentNodeId] <= rank["#"+currentNeighborId]){
                        var edgeCount = hbg.getEdgeCount(currentNodeId, currentNeighborId);
                        var j = 1;
                        var edgeMatched = false;
                        while(j <= edgeCount && !edgeMatched){
                            if(color === hbg.getColorAsInteger(currentNodeId, currentNeighborId, j)){
                                move = [currentNodeId, currentNeighborId];
                                edgeMatched = true;
                            }
                            j++;
                        }
                    }
                }
            }
            return move;
        }
    
        /**
         * return a relevent edge removable by the current player
         *
         *@param hbg : the graph representing the game
         *@param color : the color of the current player (type: integer, no particular constraint on value)
         *
         *@return a random edge removable by the current player
         *
         **/
        this.releventMove = function(hbg, color){
            var self = this;
            //FUNCTIONS
            
            /**
             * adds the concept of rank, weakness and strength to the edges
             **/
            function rateTheGraph(hbg, EnemyViewPoint){
                
                var killerId = 0;
                var ratedGraph = hbg.clone();
                
                var queue = new Array();
                var stack = new Array();
                var visited = new Array();
            
                var groundedNodesCount = ratedGraph.getGroundedNodesCount();
                //adding grounded nodes to the queue.
                for(var i = 1; i <= groundedNodesCount; i++){
                    var currentNodeId = ratedGraph.getGroundedNode(i);
                    queue.push(currentNodeId);
                    visited["#"+currentNodeId] = true;
                }
                //dequeue the queue adding the concept of rank and weakness
                while(queue.length > 0){
                    if(self.timeIsOut())return null;
                    currentNodeId = queue.shift();
                    stack.push(currentNodeId);
                    
                    var nodeValue = ratedGraph.getNodeValue(currentNodeId);
                    if(!nodeValue){
                        ratedGraph.setNodeValue(currentNodeId, new Object());
                        nodeValue = ratedGraph.getNodeValue(currentNodeId);
                        nodeValue.rank = 0;
                    }
                    if(!nodeValue.weakness)nodeValue.weakness = new Array();
                    
                    var neighborhoodSize = ratedGraph.getNeighborhoodSize(currentNodeId);
                    
                    var smallerRankFriendCount = 0;
                    var currentWeakness = new Array();
                    for( i = 1; i <= neighborhoodSize; i++){
                        var neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                        var neighborValue = ratedGraph.getNodeValue(neighborId);
                        if(!neighborValue){
                            ratedGraph.setNodeValue(neighborId, new Object());
                            neighborValue = ratedGraph.getNodeValue(neighborId);
                        }
                    
                        //enqueue unvisited nodeValue.s and set their rank
                        if(!visited["#"+neighborId]){
                            queue.push(neighborId);
                            visited["#"+neighborId] = true;
                            //propagate a rank
                            neighborValue.rank = nodeValue.rank + 1;                            
                        }
                        
                        //traversal the neighborhood to find smaller or equal rank enemy who could be dangerous (excluding loop strand)
                        if(neighborValue.rank <= nodeValue.rank && currentNodeId !== neighborId){
                            
                            var edgesCount = ratedGraph.getEdgeCount(currentNodeId, neighborId);
                            for(var k = 1; k <= edgesCount; k++){
                                var friendStrand;
                                if(EnemyViewPoint) friendStrand = (ratedGraph.getColorAsInteger(currentNodeId, neighborId, k) !== color);
                                else friendStrand = (ratedGraph.getColorAsInteger(currentNodeId, neighborId, k) === color);
                                
                                if(friendStrand) smallerRankFriendCount++;
                                else currentWeakness.push({
                                    move : [neighborId, currentNodeId],
                                    id : ++killerId
                                });
                            }
                        }
                    }
                    if(smallerRankFriendCount === 0 || nodeValue.weakness.length > 0){
                        nodeValue.weakness = nodeValue.weakness.concat(currentWeakness);
                    }
                    // propagate already existing weakness to edges from an higher rank;
                    for( i = 1; i <= neighborhoodSize; i++){
                        neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                        neighborValue = ratedGraph.getNodeValue(neighborId);
                        if(neighborValue.rank >= nodeValue.rank){
                            if(!neighborValue.weakness)neighborValue.weakness = new Array();
                            var copy = new Array();
                            copy = nodeValue.weakness.slice(0, nodeValue.weakness.length);
                            neighborValue.weakness = neighborValue.weakness.concat(copy);
                        }
                    }
                }
                
                //propagate strength
                while(stack.length > 0){
                    if(self.timeIsOut())return null;
                    currentNodeId = stack.pop();
                    nodeValue = ratedGraph.getNodeValue(currentNodeId);
                    if(!nodeValue.strength)nodeValue.strength = 0;
                    
                    neighborhoodSize = ratedGraph.getNeighborhoodSize(currentNodeId);
                    for( i = 1; i <= neighborhoodSize; i++) {
                        neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                        neighborValue = ratedGraph.getNodeValue(neighborId);
                        
                        if(neighborValue.rank >= nodeValue.rank){
                            
                            edgesCount = ratedGraph.getEdgeCount(currentNodeId, neighborId);
                            for(k = 1; k <= edgesCount; k++){
                                
                                if(EnemyViewPoint) friendStrand = (ratedGraph.getColorAsInteger(currentNodeId, neighborId, k) !== color);
                                else friendStrand = (ratedGraph.getColorAsInteger(currentNodeId, neighborId, k) === color);
                                
                                if(friendStrand) nodeValue.strength--;
                                else nodeValue.strength++;
                            }
                        }
                    }
                    for( i = 1; i <= neighborhoodSize; i++) {
                        neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                        neighborValue = ratedGraph.getNodeValue(neighborId);
                        
                        if(neighborId !== currentNodeId && neighborValue.rank <= nodeValue.rank){
                            neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                            neighborValue = ratedGraph.getNodeValue(neighborId);
                            if(!neighborValue.strength) neighborValue.strength = 0;
                            neighborValue.strength += nodeValue.strength;
                        }
                    }
                    
                }
                return ratedGraph; 
            }      
            /**
         *  find the relevent move in the ratedGraph and return it 
         **/
            function findReleventMove(enemyRatedGraph, friendRatedGraph){
                
                
                //FUNCTIONS
                
                function findWeakStrands(ratedGraph){
                    var weakStrands = new Array();
                    var queue = new Array();
                    var visited = new Array();
                    
                    var groundedNodesCount = ratedGraph.getGroundedNodesCount();
                    for(var i = 1; i <= groundedNodesCount; i++){
                        var currentNodeId = ratedGraph.getGroundedNode(i);
                        queue.push(currentNodeId);
                        visited["#"+currentNodeId] = true;
                    }
                    while(queue.length > 0){
                        if(self.timeIsOut())return null;
                        
                        currentNodeId = queue.shift();
                        if(ratedGraph.getNodeValue(currentNodeId).weakness.length > 0)weakStrands.push(currentNodeId);
                        var neighborhoodSize = ratedGraph.getNeighborhoodSize(currentNodeId);
                        for(i = 1; i <= neighborhoodSize; i++){
                            var neighborId = ratedGraph.getNeighbor(currentNodeId, i);
                            if(!visited["#"+neighborId]){
                                queue.push(neighborId);
                                visited["#"+neighborId] = true;
                            }
                        }
                    }
                    return weakStrands;
                }
                
                function filterMostProfitableMoves(friendRatedGraph, enemyRatedGraph, relevantNodes, enemyViewPoint){
                    
                    //FUNCTION
                    function isSuicidalMove(move, enemyViewPoint) {
                        
                        function countSavedStrand(enemyViewPoint) {
                            var visited = new Array();
                            var queue = new Array();
                            var savedStrandsCount = 0;
                                
                            var groundedNodesCount = enemyRatedGraph.getGroundedNodesCount();     
                            for(var i = 1; i <= groundedNodesCount; i++){
                                nodeId = enemyRatedGraph.getGroundedNode(i);   
                                if(!visited["#"+nodeId])visited["#"+nodeId] = true;
                                queue.push(nodeId);
                            }
                            
                            while(queue.length > 0){
                                if(self.timeIsOut()) return -1;
                                
                                nodeId = queue.shift();
                                if(!enemyViewPoint && nodeId === move[0]) isSafe = true;
                                
                                var neighborhoodSize = enemyRatedGraph.getNeighborhoodSize(nodeId);
                                    
                                for(var j = 1; j <= neighborhoodSize; j++){
                                    var neighborId = enemyRatedGraph.getNeighbor(nodeId,j);
                                    var edgesCount = enemyRatedGraph.getEdgeCount(nodeId, neighborId);
                                    for(k = 1; k <= edgesCount; k++){
                                            
                                        var friendStrand;
                                        if(enemyViewPoint) friendStrand = (enemyRatedGraph.getColorAsInteger(nodeId, neighborId, k) !== color);
                                        else friendStrand = (enemyRatedGraph.getColorAsInteger(nodeId, neighborId, k) === color);
                                            
                                        if(friendStrand){
                                            if(!visited["#"+neighborId]){
                                                visited["#"+neighborId] = true;
                                                queue.push(neighborId);
                                            }
                                            savedStrandsCount++;
                                        }
                                    }
                                        
                                }
                            }
                            return savedStrandsCount;
                        }
                        var isSafe = false;
                        var savedFriendStrandCount = countSavedStrand(false);
                        var savedEnemyStrandCount = countSavedStrand(true);
                        return (isSafe && savedFriendStrandCount <= savedEnemyStrandCount);
                    }
                    
                    //ALGORITHM
                    var ratedMoves = new Array();//hash
                    var ratedMoveKeys = new Array();//array
                    
                    var moves = new Array();//hash
                    var mostProfitableMoves = new Array();//array
                    
                    for(var i = 0; i < relevantNodes.length; i++) {
                        
                        var nodeId = relevantNodes[i];
                        var nodeWeakness = enemyRatedGraph.getNodeValue(nodeId).weakness;
                        var combo = new Array();
                        
                        for(var j = 0; j < nodeWeakness.length; j++){
                            if(self.timeIsOut()) return null;
                            
                            var move = nodeWeakness[j].move;
                            var moveId = nodeWeakness[j].id;
                            var moveStrength = friendRatedGraph.getNodeValue(move[1]).strength;
                            
                            if(!moves["#"+moveId]){
                                moves["#"+moveId] = move;
                                
                                if(moveStrength >= 1 && !isSuicidalMove(move)){
                                    
                                    ratedMoves["#"+moveId] = moveStrength;
                                    ratedMoveKeys.push("#"+moveId);
                                    
                                    var rootMoveValue = enemyRatedGraph.getNodeValue(move[0]);
                                
                                    for(var k = 0; k < nodeWeakness.length; k++){
                                        var rival = nodeWeakness[k].move;
                                        var rivalId = nodeWeakness[k].id;
                                        
                                        if(rivalId !== moveId){
                                            var rootRivalValue = enemyRatedGraph.getNodeValue(rival[0]);
                                    
                                            var found = false;
                                            var index = 0;
                                    
                                            while(index < rootMoveValue.weakness.length && !found){
                                                found = (rootMoveValue.weakness[index].id === rivalId);
                                                index++;
                                            }
                                            index = 0;
                                            while(index < rootRivalValue.weakness.length && !found) {
                                                found = (rootRivalValue.weakness[index].id === moveId);
                                                index++;
                                            }
                                    
                                            if(!found){
                                                if(combo.indexOf(moveId)===-1){
                                                    ratedMoves["#"+moveId]--;
                                                    combo.push(moveId);
                                                }
                                                if(combo.indexOf(rivalId)===-1){
                                                    ratedMoves["#"+rivalId]--;
                                                    combo.push(rivalId);
                                                }
                                            }
                                        }
                                    }                                    
                                }
                            }
                        }
                        for(j = 0; j< combo.length - 1; j++){
                            var max = Math.max(ratedMoves["#"+combo[j]], ratedMoves["#"+combo[j+1]]);
                            ratedMoves["#"+combo[j]] = max;
                            ratedMoves["#"+combo[j+1]] = max;
                        }
                    }
                    
                    var highestRank = -1;
                    var highestMoves = new Array();//hash
                    var highestMoveKeys = new Array();//array
                    
                    for(i = 0; i < ratedMoveKeys.length; i++){
                        var moveKey = ratedMoveKeys[i];
                        if(ratedMoves[moveKey] >= 1){
                            move = moves[moveKey];
                            var moveRank = enemyRatedGraph.getNodeValue(move[0]).rank;
                            if(moveRank > highestRank) {
                                highestRank = moveRank;
                                highestMoves = new Array();
                                highestMoveKeys = new Array();
                                highestMoves[moveKey] = true;
                                highestMoveKeys.push(moveKey);
                            }
                            else if(moveRank === highestRank){
                                highestMoves[moveKey] = true;
                                highestMoveKeys.push(moveKey);
                            }
                        }
                    }
                    if(highestMoveKeys.length === 0){
                        for(i = 0; i < ratedMoveKeys.length; i++){
                            moveKey = ratedMoveKeys[i];
                            move = moves[moveKey];
                            moveRank = enemyRatedGraph.getNodeValue(move[0]).rank;
                            if(moveRank > highestRank) {
                                highestRank = moveRank;
                                highestMoves = new Array();
                                highestMoveKeys = new Array();
                                highestMoves[moveKey] = true;
                                highestMoveKeys.push(moveKey);
                            }
                            else if(moveRank === highestRank){
                                highestMoves[moveKey] = true;
                                highestMoveKeys.push(moveKey);
                            }
                        
                        }
                    }
                    
                    var bestRate = - 10000;
                    for( i = 0; i < highestMoveKeys.length; i++){
                        moveKey = highestMoveKeys[i];
                        if(ratedMoves[moveKey] > bestRate){
                            mostProfitableMoves = new Array();
                            mostProfitableMoves.push(moves[moveKey]);
                            bestRate = ratedMoves[moveKey];
                        } 
                        else if(ratedMoves[moveKey] === bestRate) mostProfitableMoves.push(moves[moveKey]);
                    }
                    mostProfitableMoves.rate = bestRate;
                    return mostProfitableMoves;
                }
                
                
                function findWeakestStrand(friendRatedGraph, rootId){
                    var highestStrength = 0;
                    var visited = new Array();
                    var move;
                    
                    function depthTraversal(graph, rootId){
                        if(self.timeIsOut())return;
                        
                        visited["#"+rootId] = true;
                        var neighborhoodSize = graph.getNeighborhoodSize(rootId);
                        var rootStrength = graph.getNodeValue(rootId).strength;
                        
                        for(var i = 1; i <= neighborhoodSize; i++){
                            var neighborId = graph.getNeighbor(rootId, i);
                            var neighborStrength = graph.getNodeValue(neighborId).rank;
                            
                            if(neighborStrength >= rootStrength){
                                if(neighborStrength >= highestStrength){
                                    var edgesCount = graph.getEdgeCount(rootId, neighborId);
                                
                                    for(var index = 1; index <= edgesCount; index++){
                                    
                                        if(graph.getColorAsInteger(rootId, neighborId, index) === color){
                                            highestStrength = neighborStrength;
                                            move = [rootId, neighborId];
                                        }
                                    }
                                }
                            }
                            if(!visited["#"+neighborId]) depthTraversal(graph, neighborId);
                        }
                    }
                    depthTraversal(friendRatedGraph, rootId);
                    return move;
                }
                
                //ALGORITHM
                var relevantNodes = findWeakStrands(enemyRatedGraph);
                if(!relevantNodes) return null;
                
                var mostProfitableMoves = filterMostProfitableMoves(friendRatedGraph, enemyRatedGraph, relevantNodes, false);
                if(!mostProfitableMoves) return null;
                
                var leastWorstMove;
                if(!mostProfitableMoves[0] || mostProfitableMoves.rate < 1){
                    var enemyRelevantNodes = findWeakStrands(friendRatedGraph);
                    if(!enemyRelevantNodes) return null;
                    
                    var enemyMostProfitableMoves = filterMostProfitableMoves(enemyRatedGraph, friendRatedGraph, enemyRelevantNodes, true);
                    if(!enemyMostProfitableMoves) return null;
                    
                    if(enemyMostProfitableMoves[0] && enemyMostProfitableMoves[0][1] && enemyMostProfitableMoves.rate >= mostProfitableMoves.rate){
                        leastWorstMove = findWeakestStrand(friendRatedGraph, enemyMostProfitableMoves[0][1]);
                    }
                    if(!mostProfitableMoves) return null;
                }
                if(leastWorstMove) return leastWorstMove;
                return mostProfitableMoves[0];
            }
            
            //ALGORITHM
            var enemyRatedGraph = rateTheGraph(hbg, true);
            if(!enemyRatedGraph || this.timeIsOut())return null;
            
            var friendRatedGraph = rateTheGraph(hbg, false);
            if(!friendRatedGraph || this.timeIsOut()) return null;
            
            return findReleventMove(enemyRatedGraph,friendRatedGraph);
        }
    
        /** 
     * Returns the next edge to remove in hgb, a graph modeling a Red-Blue Hackenbush game
     *
     * @param hbg : the graph representing the game
     * @param color : the color of the current player (type: integer, no particular constraint on value)
     * @param lastMove : the last edge removed in hgb, as an array of integers [sourceid, destid]
     * @return the next edge to remove in hgb (undefined if impossible), as an array of integers [sourceid, destid]
     */			
        this.play = function(hbg, color, lastMove) {
            
            this.start = new Date();
            
            var noobMove = this.quickestMove(hbg, color);
            
            var releventMove = null;
            if( !this.timeIsOut()) releventMove = this.releventMove(hbg, color);
            
            console.log(new Date().valueOf() - this.start.valueOf(), "milliseconds");
            if(releventMove){
                return releventMove;
            }
            else {
                return noobMove;
            }
        } 
    }

})()