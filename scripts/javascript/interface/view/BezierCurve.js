var BezierCurve = function(startId, orientationPoint1, orientationPoint2, goalId, color){
    
    this.startId = startId;
    this.controlP1 = orientationPoint1;
    this.controlP2 = orientationPoint2;
    this.goalId = goalId;
    
    this.color = color;
    
};