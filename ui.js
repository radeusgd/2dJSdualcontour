var grid=[];//arrays for values and edges
var verticalEdgePoints=[], horizontalEdgePoints=[];

function drawLine(gfx,width,color, x1,y1, x2,y2){
   gfx.clear();
   gfx.lineStyle(width,color,1);
   gfx.moveTo(x1,y1);
   gfx.lineTo(x2,y2);
}

function updateGraphics(x,y){
   grid[x][y].frame = 1-values[x][y];

   //draw edge lines


   //normals
   //in another graphics
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
         updateGraphics(i,j);
      }
   }

}


window.onload = function() {
   game = new Phaser.Game(1400, 760, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update, render: render });

   function preload () {
      game.load.spritesheet('dots', 'dot.png', 20, 20);
   }
   function create () {
      initializeArrays();
      initializeUI();
      game.stage.backgroundColor = '#f0f0f0';

   }

   function update(){



   }
   function render(){
      //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
   }
};
