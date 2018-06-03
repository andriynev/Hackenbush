/**
 * Creates a new graph, directed or not
 *
 * @param directed tells if the graph is directed or not
 * @return a reference on an empty graph
 */
var AbstractSimpleGraph = function(directed){

	/** 
	 * Adds an edge between nodes identified by sourceId and destId, with an undefined weight 
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @throws InvalidIdException if one of the specified ids is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist
	 * @throws AlreadyExistingEdgeException if the specified edge already exists
	 */
	this.addEdge = function(sourceId, destId) {}

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
	this.addWeightedEdge = function(sourceId, destId, weight) {}

	/** 
	 * Adds a node with the specified identifier, with an undefined weight  
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
	 */		
	this.addNode = function(id) {}

	/** 
	 * Adds a node with the specified identifier and weight
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @param weight the weight of the node	 
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
	 */		
	this.addWeightedNode = function(id, weight) {}
	
	/** 
	 * Tells if an edge exists between nodes identified by sourceId and destId 
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @return a boolean modeling the existence of the specified edge
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist		 
	 */		
	this.edgeExists = function(sourceId, destId) {}

	
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
	this.getEdgeValue = function(sourceId, destId) {}

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
	this.getNeighbor = function(id, k) {}

	/** 
	 * Returns the number of neighbors of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return the size of the neighborhood of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */			
	this.getNeighborhoodSize = function(id) {}

	/** 
	 * Returns the value of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return the value of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */			
	this.getNodeValue = function(id) {}

	/** 
	 * Returns the order of this
	 *
	 * @return the order of this
	 */		
	this.getOrder = function() {}

	/** 
	 * Tells if a node exists with the specified identifier
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @return a boolean modeling the existence of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 */		
	this.nodeExists = function(id) {}
	
	
	/** 
	 * Removes an edge between nodes identified by sourceId and destId
	 *
	 * @param sourceId the identifier of the source node (strictly positive integer)
	 * @param destId the identifier of the destination node (strictly positive integer)
	 * @throws InvalidIdException if one of the specified ids is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws UnexistingEdgeException if the ids are valid, the corresponding nodes exists, but the corresponding edge does not exist	 

	 */	
	this.removeEdge = function(sourceId, destId) {}

	/** 
	 * Removes a node with the specified identifier
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */		
	this.removeNode = function(id) {}
	
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
	this.setEdgeValue = function(sourceId, destId, value) {}

	/** 
	 * Updates the value of all edges 
	 *
	 * @param value the new value for all edges 
	 */		
	this.setEdgesValues = function(value) {}

	
	/** 
	 * Updates the value of the node identified by id
	 *
	 * @param id the identifier of the node (strictly positive integer)
	 * @param value the new value for the specified node 
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
	 * @throws UnexistingNodeException if the id is valid but the corresponding node does not exist	 
	 */		
	this.setNodeValue = function(id, value) {}

	
	/** 
	 * Updates the value of all nodes 
	 *
	 * @param value the new value for all nodes 
	 */	
	this.setNodesValues = function(value) {}

}
