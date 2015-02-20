window.onload = function() {
   game = new Phaser.Game(1440, 1024, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update, render: render });

   function preload () {

   }
   function create () {
      game.stage.backgroundColor = '#f0f0f0';

   }

   function update(){



   }
   function render(){
      //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
   }
};
