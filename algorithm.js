var gridWidth = 22;
var gridHeight = 12;

var values=[], positions=[];//arrays for values and edges
var verticalEdges=[], horizontalEdges=[];
//values are currently 0 for empty and 1 for material
//TODO add more materials

function initializeArrays(){
   var i,j;
   for(i=0;i<gridWidth;i++){
      values[i] = [];
      positions[i] = [];
      for(j=0;j<gridHeight;j++){
         values[i][j]=0;//init to air
         positions[i][j]={x:0.5,y:0.5};
      }
   }
   for(i=0;i<gridWidth-1;i++){
      verticalEdges[i] = [];
      horizontalEdges[i] = [];
      for(j=0;j<gridHeight-1;j++){
         verticalEdges[i][j]={p:0,nx:0,ny:0};//no intersection
         horizontalEdges[i][j]={p:0,nx:0,ny:0};//no intersection
      }
   }
}


function updateGrid(x,y){
   if(x<0||y<0) return;
   //recompute current gridposition

   //rerender edges
   rerenderEdge(x,y,true);
   rerenderEdge(x,y,false);
   rerenderEdge(x+1,y,true);
   rerenderEdge(x,y+1,false);
}

function updateEdge(x,y,isVertical){
   //update neighbouring grids
   updateGrid(x,y);
   if(isVertical){
      updateGrid(x-1,y);
   }
   else{
      updateGrid(x,y-1);
   }
}

function rerenderEdge(x,y,isVertical){

}
