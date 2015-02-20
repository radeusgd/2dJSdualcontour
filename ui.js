var grid=[];//arrays for values and edges
var verticalEdgePoints=[], horizontalEdgePoints=[];

function clamp(num, min, max) {
   return num < min ? min : (num > max ? max : num);
}

function drawLine(gfx,width,color, x1,y1, x2,y2){
   gfx.clear();
   gfx.lineStyle(width,color,1);
   gfx.moveTo(x1,y1);
   gfx.lineTo(x2,y2);
}

function updateGraphics(x,y){
   grid[x][y].frame = 1-values[x][y];

   if(y<gridHeight-1 && values[x][y]!=values[x][y+1]){
      addEdge(x,y,true);
   }else{
      removeEdge(x,y,true);
   }
   if(y>1 && values[x][y]!=values[x][y-1]){
      addEdge(x,y-1,true);
   }
   else{
      removeEdge(x,y-1,true);
   }
   if(x<gridWidth-1 && values[x][y]!=values[x+1][y]){
      addEdge(x,y,false);
   }
   else{
      removeEdge(x,y,false);
   }
   if(x>1 && values[x][y]!=values[x-1][y]){
      addEdge(x-1,y,false);
   }
   else{
      removeEdge(x-1,y,false);
   }
}

function makeClickHandler(x,y){
   grid[x][y].events.onInputDown.add(function(){
      if(values[x][y]===0){
         values[x][y]=1;
      }else{
         values[x][y]=0;
      }
      updateGraphics(x,y);
   });
}

function addNormal(parent, vx,vy){
   parent.normal = game.add.graphics(0,0);
   parent.normal.handle = game.add.sprite(vx,vy,'normal');
   parent.normal.handle.origin={x:0.5,y:0.5};
   parent.normal.refreshLine=function(x,y){
      drawLine(parent.normal,4,0xFF0000,5,5,x,y);
   };
   parent.normal.handle.vx=vx;
   parent.normal.handle.vy=vy;
   parent.normal.refreshLine(vx,vy);
   parent.normal.handle.update = function(){
      parent.normal.x=parent.handle.x;
      parent.normal.y=parent.handle.y;
      parent.normal.handle.x=parent.handle.x+parent.normal.handle.vx;
      parent.normal.handle.y=parent.handle.y+parent.normal.handle.vy;
      if(parent.normal.handle.dragging){
         var vx=game.input.x-parent.normal.x,vy=game.input.y-parent.normal.y;
         var len=Math.sqrt(vx*vx+vy*vy);
         vx=32*vx/len;
         vy=32*vy/len;
         parent.normal.handle.vx=vx;
         parent.normal.handle.vy=vy;
         parent.normal.handle.x=parent.normal.x+vx;
         parent.normal.handle.y=parent.normal.y+vy;
         parent.normal.refreshLine(parent.normal.handle.x-parent.normal.x+5,parent.normal.handle.y-parent.normal.y+5);
      }
   };
   parent.normal.handle.inputEnabled=true;
   parent.normal.handle.events.onInputDown.add(function(){
      parent.normal.handle.dragging=true;
   });
   parent.normal.handle.events.onInputUp.add(function(){
      parent.normal.handle.dragging=false;
   });
}

function addEdge(x,y,isVertical){
   if(isVertical){
      verticalEdgePoints[x][y] = game.add.graphics(x*64,y*64);
      //drawLine(verticalEdgePoints[x][y],)
      verticalEdgePoints[x][y].handle = game.add.sprite(x*64,y*64+32,'handle');
      verticalEdgePoints[x][y].handle.inputEnabled=true;
      verticalEdgePoints[x][y].handle.refreshLine = function(){
         if(values[x][y]>0){
            drawLine(verticalEdgePoints[x][y],4,0x0022FF,10,0,10,verticalEdgePoints[x][y].handle.y-y*64);
         }
         else{
            drawLine(verticalEdgePoints[x][y],4,0x0022FF,10,64,10,verticalEdgePoints[x][y].handle.y-y*64);
         }
      };
      verticalEdgePoints[x][y].handle.update = function(){
         if(verticalEdgePoints[x][y].handle.dragging){
            verticalEdgePoints[x][y].handle.y=clamp(game.input.y,y*64,y*64+64);
            verticalEdgePoints[x][y].handle.refreshLine();
            //TODO update ALGO
         }
      };
      verticalEdgePoints[x][y].handle.refreshLine();
      verticalEdgePoints[x][y].handle.events.onInputDown.add(function(){
         verticalEdgePoints[x][y].handle.dragging=true;
      });
      verticalEdgePoints[x][y].handle.events.onInputUp.add(function(){
         verticalEdgePoints[x][y].handle.dragging=false;
      });
      if(values[x][y]>0){
         addNormal(verticalEdgePoints[x][y],0,32);
      }
      else{
         addNormal(verticalEdgePoints[x][y],0,-32);
      }
   }else{
      horizontalEdgePoints[x][y] = game.add.graphics(x*64,y*64);
      //drawLine(verticalEdgePoints[x][y],)
      horizontalEdgePoints[x][y].handle = game.add.sprite(x*64+32,y*64,'handle');
      horizontalEdgePoints[x][y].handle.inputEnabled=true;
      horizontalEdgePoints[x][y].handle.refreshLine = function(){
         if(values[x][y]>0){
            drawLine(horizontalEdgePoints[x][y],4,0x0022FF,0,10,horizontalEdgePoints[x][y].handle.x-x*64,10);
         }
         else{
            drawLine(horizontalEdgePoints[x][y],4,0x0022FF,64,10,horizontalEdgePoints[x][y].handle.x-x*64,10);
         }
      };
      horizontalEdgePoints[x][y].handle.update = function(){
         if(horizontalEdgePoints[x][y].handle.dragging){
            horizontalEdgePoints[x][y].handle.x=clamp(game.input.x,x*64,x*64+64);
            horizontalEdgePoints[x][y].handle.refreshLine();
            //TODO update ALGO
         }
      };
      horizontalEdgePoints[x][y].handle.refreshLine();
      horizontalEdgePoints[x][y].handle.events.onInputDown.add(function(){
         horizontalEdgePoints[x][y].handle.dragging=true;
      });
      horizontalEdgePoints[x][y].handle.events.onInputUp.add(function(){
         horizontalEdgePoints[x][y].handle.dragging=false;
      });
      if(values[x][y]>0){
         addNormal(horizontalEdgePoints[x][y],32,0);
      }
      else{
         addNormal(horizontalEdgePoints[x][y],-32,0);
      }
   }
}

function removeEdge(x,y,isVertical){
   if(isVertical){
      verticalEdgePoints[x][y].handle.destroy(true);
      verticalEdgePoints[x][y].normal.handle.destroy(true);
      verticalEdgePoints[x][y].normal.destroy(true);
      verticalEdgePoints[x][y].destroy(true);
      verticalEdgePoints[x][y]=null;
      //TODO normal vector
   }else{
      horizontalEdgePoints[x][y].handle.destroy(true);
      horizontalEdgePoints[x][y].normal.handle.destroy(true);
      horizontalEdgePoints[x][y].normal.destroy(true);
      horizontalEdgePoints[x][y].destroy(true);
   }
}

function initializeUI(){
   var i,j;
   for(i=0;i<gridWidth;i++){
      verticalEdgePoints[i] = [];
      horizontalEdgePoints[i] = [];
      for(j=0;j<gridHeight;j++){
         verticalEdgePoints[i][j]=game.add.graphics(i*64,j*64);
         horizontalEdgePoints[i][j]=game.add.graphics(i*64,j*64);
         drawLine(verticalEdgePoints[i][j],1,0x555555,10,10,10,74);
         drawLine(horizontalEdgePoints[i][j],1,0x555555,10,10,74,10);
      }
   }
   for(i=0;i<gridWidth;i++){
      grid[i] = [];
      for(j=0;j<gridHeight;j++){
         grid[i][j]=game.add.sprite(i*64,j*64,'dots',1);
         grid[i][j].inputEnabled=true;
         makeClickHandler(i,j);
         //updateGraphics(i,j);
      }
   }

}
/*needUpdate = [];
function queueUpdates(obj){
   needUpdate.push(obj);
}
function unqueueUpdates(obj){
   var i = needUpdate.indexOf(obj);
   if(i>-1){
      needUpdate.splice(i,1);
   }
}*/

window.onload = function() {
   game = new Phaser.Game(1400, 760, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update, render: render });

   function preload () {
      game.load.spritesheet('dots', 'dot.png', 20, 20);
      game.load.spritesheet('handle', 'handle.png', 20, 20);
      game.load.spritesheet('normal', 'normal.png', 20, 20);
   }
   function create () {
      initializeArrays();
      initializeUI();
      game.stage.backgroundColor = '#f0f0f0';

   }

   function update(){
      /*needUpdate.forEach(function(obj){
         //obj.update();
      });*/
   }
   function render(){
      //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
   }
};
