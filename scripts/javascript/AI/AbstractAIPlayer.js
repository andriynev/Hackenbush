/**
 * Creates a new Absract AI player
 *
 * @return a reference on an abstract AI player
 */
 
var AbstractAIPlayer = function(){

	/** 
	 * Returns the next edge to remove in abstrHbGraph, a graph modeling a Red-Blue Hackenbush game
	 *
	 * @param abstrHbGraph an AbstractHackenbushGraph instance
	 * @param color the color of the current player (type: integer, no particular constraint on value)
	 * @param lastmove the last edge removed in abstrHbGraph, as an array of integers [sourceid, destid]
	 * @return the next edge to remove in abstrHbGraph (undefined if impossible), as an array of integers [sourceid, destid]
	 */			
	this.play = function(abstrHbGraph, color, lastMove) { } 


}