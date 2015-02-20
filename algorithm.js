var gridWidth = 22;
var gridHeight = 12;

var values=[];//arrays for values and edges
var verticalEdges=[], horizontalEdges=[];
//values are currently 0 for empty and 1 for material
//TODO add more materials

function initializeArrays(){
   var i,j;
   for(i=0;i<gridWidth;i++){
      values[i] = [];
      for(j=0;j<gridHeight;j++){
         values[i][j]=0;//init to air
      }
   }
   for(i=0;i<gridWidth-1;i++){
      verticalEdges[i] = [];
      horizontalEdges[i] = [];
      for(j=0;j<gridHeight-1;j++){
         verticalEdges[i][j]=null;//no intersection
         horizontalEdges[i][j]=null;//no intersection
      }
   }
}


function updateValue(x,y){
   //TODO re
}
