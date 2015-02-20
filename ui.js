var grid=[];//arrays for values and edges
var verticalEdgePoints=[], horizontalEdgePoints=[];
//values are currently 0 for empty and 1 for material
//TODO add more materials

function makeClickHandler(x,y){
   grid[x][y].events.onInputDown.add(function(){
      if(values[x][y]===0){
         values[x][y]=1;
      }else{
         values[x][y]=0;
      }
      grid[x][y].frame = 1-values[x][y];
   });
}

function initializeUI(){
   var i,j;
   for(i=0;i<gridWidth;i++){
      grid[i] = [];
      for(j=0;j<gridHeight;j++){
         grid[i][j]=game.add.sprite(i*64,j*64,'dots',1);
         grid[i][j].inputEnabled=true;
         makeClickHandler(i,j);
      }
   }
   for(i=0;i<gridWidth;i++){
      verticalEdgePoints[i] = [];
      horizontalEdgePoints[i] = [];
      for(j=0;j<gridHeight;j++){
         verticalEdgePoints[i][j]=null;//no intersection
         horizontalEdgePoints[i][j]=null;//no intersection
      }
   }
}


window.onload = function() {
   game = new Phaser.Game(1440, 800, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update, render: render });

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
