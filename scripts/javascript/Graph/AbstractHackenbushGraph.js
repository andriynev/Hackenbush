/**
 * Creates a new Hackenbush graph.
 * AbstractHackenbushGraph inherits from AbstractGraph and adds methods which are specific to the Hackenbush game.
 *
 * @return a reference on an empty Hackenbush graph
 */
 
var AbstractHackenbushGraph = function(){

	AbstractSimpleGraph.call(this, false); // false: the graph modeling an Hackenbush game is not directed 
	
	/** 
	 * Returns the degree of the node identified by id, in the context of a multigraph (i.e. the number of edges linked to this node)
	 * getDegree and getNeighborhoodSize return the same result in a simple graph.
	 *
	 * @param id the identifier of a node (strictly positive integer)
	 * @return the degree of the specified node
	 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the id is valid the corresponding node does not exist	  
	 */			
	this.getDegree = function(id) {}

	/** 
	 * Returns the number of edges between nodes identified by sourceid and destid
	 * @param sourceid the identifier of the source node (strictly positive integeAbstractHackenbushGraph.jsr)
	 * @param destid the identifier of the destination node (strictly positive integer)
	 * @return the number of edges between nodes identified by sourceid and destid
	 * @throws InvalidIdException if one the specified ids is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 */			
	this.getEdgeCount = function(sourceid, destid) {}	
	
	
	/** 
	 * Returns, as an integer, the color of the k th edge between nodes identified by sourceid and destid
	 *
	 * @param sourceid the identifier of the source node (strictly positive integer)
	 * @param destid the identifier of the destination node (strictly positive integer)
	 * @param k the number of the edge to evaluate (between 1 and getEdgeCount(sourceid))
	 * @return an integer modeling the color of the specified edge
	 * @throws InvalidIdException if one the specified ids is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws InvalidIndexException if the nodes exist but k is outside the allowed range
	 */			
	this.getColorAsInteger = function(sourceid, destid, k) {}	
	

	/** 
	 * Removes the k th edge between nodes identified by sourceid and destid
	 *
	 * @param sourceid the identifier of the source node (strictly positive integer)
	 * @param destid the identifier of the destination node (strictly positive integer)
	 * @param k the number of the edge to evaluate (between 1 and getEdgeCount(sourceid))
	 * @throws InvalidIdException if one the specified ids is not valid (wrong type, <= 0, ...)	
	 * @throws UnexistingNodeException if the ids are valid but one of the corresponding nodes does not exist	 
	 * @throws InvalidIndexException if the nodes exist but k is outside the allowed range
	 */			
	this.remove = function(sourceid, destid, k) {}		
	

	/** 
	 * Returns the identifier of the k th grounded node.
	 *
	 * @param k the number of the grounded node to identify (between 1 and getGroundedNodesCount())
	 * @return the identifier of the k th grounded node
	 * @throws InvalidIndexException if k is outside the allowed range
	 */		
	this.getGroundedNode = function(k) {}	
	
	/** 
	 * Clones the current AbstractHackenbushGraph instance.
	 *
	 * @return a clone of this
	 */			
	this.clone = function() {}	
	
	
	/** 
	 * Returns the number of grounded nodes (i.e. linked to the ground).
	 *
	 * @return the number of grounded nodes
	 */			
	this.getGroundedNodesCount = function(){}		
	
}
