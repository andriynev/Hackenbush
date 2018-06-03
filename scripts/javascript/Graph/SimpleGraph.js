/**
 * Creates a new graph, directed or not
 *
 * @param directed tells if the graph is directed or not
 * @return a reference on an empty graph
 */
var SimpleGraph = function(directed){
    /* **************
     * inheritance: *
     ****************/
    AbstractSimpleGraph.call(this,directed);
    this.directed = directed;
    this.nodes = new Array();
    this.edgeIdCounter = 0;
    
    /** 
	 * Returns the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist
	 */
    this.getNodeById = function(id) {
        if (!this.nodeExists(id))
            throw new UnexistingNodeException(id);

        return this.nodes['#'+id];
    }
    /* **************************
 * overloading functions:   *
 * **************************/
    
    /** 
	 * Adds an edge between nodes identified by sourceId and destId, with an undefined weight 
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @throws InvalidIdException if one of the specified ids is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist
	 * @throws AlreadyExistingEdgeException if the specified edge already exists
	 */
    this.addEdge = function(sourceId, destId) {
        this.addWeightedEdge(sourceId, destId, undefined);
    }
    /** 
	 * Adds an edge between nodes identified by sourceId and destId, with the specified weight 
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @param weight the weight of the edge
	 * @throws InvalidIdException if one of the specified ids is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist
	 * @throws AlreadyExistingEdgeException if the specified edge already exists
	 */	
    this.addWeightedEdge = function(sourceId, destId, weight) {
        if (this.edgeExists(sourceId, destId))
            throw new AlreadyExistingEdgeException(sourceId, destId);

        var edge = new Edge(weight, ++this.edgeIdCounter);

        this.nodes['#'+sourceId].neighbors['#'+destId] = edge;
        this.incrNeighborsSize(sourceId);

        if (!this.directed && destId !== sourceId) {
            this.nodes['#'+destId].neighbors['#'+sourceId] = edge;
            this.incrNeighborsSize(destId);
        }
    }

    /** 
	 * Adds a node with the specified identifier, with an undefined weight  
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
	 */		
    this.addNode = function(id) {
        this.addWeightedNode(id, undefined);
    }

    /** 
	 * Adds a node with the specified identifier and weight
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @param weight the weight of the node	 
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
	 */		
    this.addWeightedNode = function(id, weight) {
        if (this.nodeExists(id))
            throw new AlreadyExistingNodeException(id);

        this.addWeightedNodeWithoutCheck(id, weight);
    }

	this.addWeightedNodeWithoutCheck = function(id, weight) {
        this.nodes['#'+id] = new Node(id, weight);
        this.nodes['#'+id].neighbors = new Array();
        this.incrNodesSize();
    }

    /** 
	 * Tells if an edge exists between nodes identified by sourceId and destId 
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @return a boolean modeling the existence of the specified edge
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist		 
	 */		
    this.edgeExists = function(sourceId, destId) {

        if (!this.nodeExists(sourceId))
            throw new UnexistingNodeException(sourceId);
            
        if (!this.nodeExists(destId))
            throw new UnexistingNodeException(destId);

        if (this.nodes['#'+sourceId].neighbors['#'+destId])
            return true;
        else
            return false;
    }

	
    /** 
	 * Returns the value of the edge between nodes identified by sourceId and destId
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @return the value of the specified edge
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws UnexistingEdgeException if the ids are valid, the corresponding nodes exists, but the corresponding edge does not exist	 
	 */			
    this.getEdgeValue = function(sourceId, destId) {
        return this.getEdgeById(sourceId, destId).weight;
    }


    /** 
	 * Returns the edge between nodes identified by sourceId and destId
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @return the specified edge
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws UnexistingEdgeException if the ids are valid, the corresponding nodes exists, but the corresponding edge does not exist	 
	 */
    this.getEdgeById = function(sourceId, destId) {
        if (!this.edgeExists(sourceId, destId))
            throw new UnexistingEdgeException(sourceId, destId);

        return this.nodes['#'+sourceId].neighbors['#'+destId];
    }

    /** 
	 * Returns the identifier of the k th neighbor of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @param k the number of the neighbor (between 1 and getNeighborhoodSize(id))	 
	 * @return the identifier of the k th neighbor of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 * @throws InvalidIndexException if k is outside the allowed range	 
	 */		
    this.getNeighbor = function(id, k) {
        if(!this.nodeExists(id)) 
            throw new UnexistingNodeException(id);
        
        var neighborSize = this.getNeighborhoodSize(id);
        
        if (!this.isInt(k) || k > neighborSize || k <= 0)
            throw new InvalidIndexException(k);
        
        var destId;
        var i = 1;


        for (destId in this.nodes['#'+id].neighbors) {
            if (i === k)
                return this.splitId(destId);
            i++;
        }
    }

    /** 
	 * Returns the number of neighbors of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return the size of the neighborhood of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */			
    this.getNeighborhoodSize = function(id) {
        return this.getNodeById(id).neighbors.length;
    }

    /** 
	 * Returns the value of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return the value of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */			
    this.getNodeValue = function(id) {
        return this.getNodeById(id).weight;
    }

    /** 
	 * Returns the order of this
	 *
	 * @return the order of this
	 */		
    this.getOrder = function() {
        return this.nodes.length;
    }

    /** 
	 * Tells if a node exists with the specified identifier
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return a boolean modeling the existence of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 */	
    this.nodeExists = function(id) {        
        if (!this.isInt(id) || id <= 0)
            throw new InvalidIdException(id);

        if (this.nodes['#'+id])
            return true;
        else
            return false;
    }
	
	
    /** 
	 * Removes an edge between nodes identified by sourceId and destId
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @throws InvalidIdException if one of the specified ids is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws UnexistingEdgeException if the ids are valid, the corresponding nodes exists, but the corresponding edge does not exist	 

	 */	
    this.removeEdge = function(sourceId, destId) {
        if (!this.edgeExists(sourceId, destId))
            throw new UnexistingEdgeException(sourceId, destId);

        delete this.nodes['#'+sourceId].neighbors['#'+destId];
        this.decrNeighborsSize(sourceId);
        if (!directed && sourceId !== destId) {
            delete this.nodes['#'+destId].neighbors['#'+sourceId];
            this.decrNeighborsSize(destId);
        }
    }

    /** 
	 * Removes a node with the specified identifier
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */		
    this.removeNode = function(id) {
        if (!this.nodeExists(id))
            throw new UnexistingNodeException(id);

        // Delete the expected node and edges in relation with it
        var sourceId, destId, sourceIdInt;
        var idString = '#'+id;

        // if the graph isn't directed, we can get all node directly connected with the id.
        if (!this.directed) { 
            for (sourceId in this.nodes[idString].neighbors) { 
                // does not call removeNode to avoid all checks and problems with #id != id. We could split but I prefer this solution.
                delete this.nodes[sourceId].neighbors[idString];
                this.decrNeighborsSize(this.splitId(sourceId));
            }
        }
		
        if (this.directed) {
            for (sourceId in this.nodes) {
                sourceIdInt = this.splitId(sourceId);
                if (this.edgeExists(sourceIdInt, id)) {
                    delete this.nodes[sourceId].neighbors[idString];
                    this.decrNeighborsSize(sourceIdInt);
                }
            }
        }

        delete this.nodes[idString];
        this.decrNodesSize();
    }
	
    /** 
	 * Updates the value of the edge between nodes identified by sourceId and destId
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @param value the new value for the specified edge 
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws UnexistingEdgeException if the ids are valid, the corresponding nodes exists, but the corresponding edge does not exist	 

	 */	
    this.setEdgeValue = function(sourceId, destId, value) {
        this.getEdgeById(sourceId, destId).weight = value;
		// doesn't have to do twice if !directed because this is the same edge between sourceId, destId and destId, sourceId
    }

    /** 
	 * Updates the value of all edges 
	 *
	 * @param value the new value for all edges 
	 */		
    this.setEdgesValues = function(value) {
        var sourceId, destId, NSize;
        for (sourceId in this.nodes) {
            for (destId in this.nodes[sourceId].neighbors) { 
                // does not call getNeighbor function, because it would be slower.
                // does not call setEdgeValue to avoid all checks and problems with "#id != id". We could split but I prefer this solution.
                this.nodes[sourceId].neighbors[destId].weight = value;  
            }
        }
    }

	
    /** 
	 * Updates the value of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @param value the new value for the specified node 
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */		
    this.setNodeValue = function(id, value) {
        this.getNodeById(id).weight = value;
    }

	
    /** 
	 * Updates the value of all nodes 
	 *
	 * @param value the new value for all nodes 
	 */	
    this.setNodesValues = function(value) {
        var idN;
        for (idN in this.nodes) {
            // does not call setNodeValue to avoid all checks and problems with "#id != id". We could split but I prefer this solution.
            this.nodes[idN].weight = value; 
        }
    }

	/**
	 *  @param idString of a node : #id
	 *  @return the integer part of idString : id
	 */
    this.splitId = function(idString) {
        var id = idString.split('#');
        return parseInt(id[1]);
    }

	/**
	 * Check if the id is an integer or not
	 * 
	 * @param value, an id
	 * @return true if the id is an integer and false if isn't
	 */
	this.isInt = function(value){
		if(value === parseInt(value))
			return true;
		else
			return false;
	}

    /**
     *  It is necessary to increment/decrement manually the length member of a hash table.
     */
    this.incrNodesSize = function() {
        this.nodes.length++;
    }

    this.decrNodesSize = function() {
        this.nodes.length--;
    }

    /** 
	 * Increment or Decrement the neighbors Size of the given node (because in hash table, this isn't automatic)
	 *
	 * @param id the identifier of a node (strictly positive integer)
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid the corresponding node does not exist	  
	 */	
    this.incrNeighborsSize = function(id) {
        this.getNodeById(id).neighbors.length++;
    }

    this.decrNeighborsSize = function(id) {
        this.getNodeById(id).neighbors.length--;
	}
}	
