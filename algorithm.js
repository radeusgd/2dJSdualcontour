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
   for(i=0;i<gridWidth;i++){
      verticalEdges[i] = [];
      horizontalEdges[i] = [];
      for(j=0;j<gridHeight;j++){
         verticalEdges[i][j]={p:0,nx:1,ny:0};//no intersection
         horizontalEdges[i][j]={p:0,nx:0,ny:1};//no intersection
      }
   }
}
function getValue(x,y){
   if(x<0||x>=gridWidth||y<0||y>=gridHeight) return 0;//default to air
   return values[x][y];
}

function gridHasSignChange(x,y){
   var sgn = getValue(x,y);
   for(var i=0;i<2;i++){
      for(var j=0;j<2;j++){
         if(sgn!=getValue(x+i,y+j)) return true;//TODO more materials
      }
   }
   return false;
}
function edgeHasSignChange(x,y,isVertical){
   if(isVertical){
      return (getValue(x,y)!=getValue(x,y+1));
   }else{
      return (getValue(x,y)!=getValue(x+1,y));
   }
}

function getIntersectionPoint(x,y,isVertical,dx,dy){
   if(x<0||x>=gridWidth||y<0||y>=gridHeight) return {x:dx+0.5,y:dy+0.5};
   if(isVertical){
      return {x:dx, y:dy+verticalEdges[x][y].p};
   }else{
      return {x:dx+horizontalEdges[x][y].p, y:dy};
   }
}

function updateSquare(x,y){
   if(x<0||y<0) return;
   //recompute current gridposition
   var px=0.0,py=0.0,sx=0.0,sy=0.0;
   if(gridHasSignChange(x,y)){
      var p,n;
      if(edgeHasSignChange(x,y,true)){
         p = getIntersectionPoint(x,y,true,0,0);
         n = verticalEdges[x][y];
         px+=p.x*n.nx*n.nx;
         sx+=n.nx*n.nx;
         py+=p.y*n.ny*n.ny;
         sy+=n.ny*n.ny;
      }
      if(edgeHasSignChange(x,y,false)){
         p = getIntersectionPoint(x,y,false,0,0);
         n = horizontalEdges[x][y];
         px+=p.x*n.nx*n.nx;
         sx+=n.nx*n.nx;
         py+=p.y*n.ny*n.ny;
         sy+=n.ny*n.ny;
      }
      if(edgeHasSignChange(x+1,y,true)){
         p = getIntersectionPoint(x+1,y,true,1,0);
         n = verticalEdges[x+1][y];
         px+=p.x*n.nx*n.nx;
         sx+=n.nx*n.nx;
         py+=p.y*n.ny*n.ny;
         sy+=n.ny*n.ny;
      }
      if(edgeHasSignChange(x,y+1,false)){
         p = getIntersectionPoint(x,y+1,false,0,1);
         n = horizontalEdges[x][y+1];
         px+=p.x*n.nx*n.nx;
         sx+=n.nx*n.nx;
         py+=p.y*n.ny*n.ny;
         sy+=n.ny*n.ny;
      }
      px/=sx;
      py/=sy;
      //px = clamp(px,0,1);
      //py = clamp(py,0,1);
      positions[x][y] = {x:px,y:py};
      renderer_updatePosition(x,y,px,py);
      //console.log(x,y,px,py,sx,sy);
   }else{
      positions[x][y].x=0.5;//reset
      positions[x][y].y=0.5;//reset
   }
   //rerender edges
   rerenderEdge(x,y,true);
   rerenderEdge(x,y,false);
   rerenderEdge(x+1,y,true);
   rerenderEdge(x,y+1,false);
}

function updateEdge(x,y,isVertical){
   //update neighbouring grids
   updateSquare(x,y);
   if(isVertical){
      updateSquare(x-1,y);
   }
   else{
      updateSquare(x,y-1);
   }
}

function getGridPos(x,y){
   if(x<0||x>=gridWidth||y<0||y>=gridHeight)
      return {x:x*64+32,y:y*64+32};
   return {x:x*64+(positions[x][y].x*64),y:y*64+(positions[x][y].y*64)};
}

function rerenderEdge(x,y,isVertical){
   var a,b;
   if(edgeHasSignChange(x,y,isVertical)){
      if(isVertical){
         a=getGridPos(x-1,y);
         b=getGridPos(x,y);
         renderer_updateEdge(x,y,isVertical, a.x+10,a.y+10,b.x+10,b.y+10);
      }else{
         a=getGridPos(x,y-1);
         b=getGridPos(x,y);
         renderer_updateEdge(x,y,isVertical, a.x+10,a.y+10,b.x+10,b.y+10);
      }
   }else{
      renderer_removeEdge(x,y,isVertical);
   }
}
