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
         verticalEdges[i][j]={p:0,nx:1,ny:1};//no intersection
         horizontalEdges[i][j]={p:0,nx:1,ny:1};//no intersection
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
///QEF

function add(a,b){
   return {x:a.x+b.x,y:a.y+b.y};
}

function mul(v,x){
   return {x:v.x*x,y:v.y*x};
}

function vec(from, to){
   return {x:to.x-from.x,y:to.y-from.y};
}

function cross(a,b){
   return a.x*b.y - b.x*a.y;
}

function dot(a,b){
   return a.x*b.x+a.y*b.y;
}

function len(v){
   return Math.sqrt(v.x*v.x+v.y*v.y);
}

function normalize(v){
   return mul(v,1/len(v));
}

function normalToRightVector(normal){
   return {x:-normal.y,y:normal.x};
}

function projection(planeNormal, planePoint, point){
   //console.log(planeNormal, planePoint, point);
   //console.log(planePoint);
   /*var plane = normalToRightVector(planeNormal);
   var p = add(point,mul(planePoint,-1));//convert to planePoint based coord
   //console.log(plane,p);
   p = mul(plane, dot(point,plane));//project onto plane
   p = add(p, planePoint);//go back to our coords*/

   //distance of point is the projection of pp vector onto plane normal
   //planeNormal=normalize(planeNormal);
   var v = vec(planePoint,point);
   v = mul(v,dot(planeNormal, v));
   //console.log(p,v);
   var p = mul(planeNormal,len(v));//moving from point onto plane
   if(cross(normalToRightVector(planeNormal),v)>0) return add(point,mul(p,-1));
   else return add(point,p);
}

function updateSquare(x,y){
   if(x<0||y<0) return;
   //recompute current gridposition
   if(gridHasSignChange(x,y)){
      var intersections = [];
      if(edgeHasSignChange(x,y,true)){
         intersections.push({p:getIntersectionPoint(x,y,true,0,0),n:verticalEdges[x][y]});
      }
      if(edgeHasSignChange(x,y,false)){
         intersections.push({p:getIntersectionPoint(x,y,false,0,0),n:horizontalEdges[x][y]});
      }
      if(edgeHasSignChange(x+1,y,true)){
         intersections.push({p:getIntersectionPoint(x+1,y,true,1,0),n:verticalEdges[x+1][y]});
      }
      if(edgeHasSignChange(x,y+1,false)){
         intersections.push({p:getIntersectionPoint(x,y+1,false,0,1),n:horizontalEdges[x][y+1]});
      }
      for(var ii=0;ii<intersections.length;ii++){
         intersections[ii].n  = {x:intersections[ii].n.nx,y:intersections[ii].n.ny};
      }

      var point = {x:0.5,y:0.5};
      var NUMITERATIONS = 4;
      for(var step=0;step<NUMITERATIONS;step++){
         var move = {x:0,y:0};
         for(var i=0;i<intersections.length;i++){
            var p = intersections[i].p;
            var n = intersections[i].n;
            move = add(move, vec(point, projection(n,p,point)));
            //console.log(point,p,n, projection(n,p,point));
         }
         move = mul(move,0.2);
         point = add(point,move);
      }

      //px = clamp(px,0,1);//it doesn't seem to be needed?
      //py = clamp(py,0,1);
      positions[x][y] = point;
      renderer_updatePosition(x,y,point.x,point.y);
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
