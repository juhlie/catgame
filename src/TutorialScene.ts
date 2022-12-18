import { GridEngine } from "grid-engine";

export default class TutorialScene extends Phaser.Scene {
  gridEngine: GridEngine; // doesn't do anything, but gets rid of error message

  public preload() {
    this.load.image("tiles", "assets/img/lofi_pastels.png");
    this.load.tilemapTiledJSON("tutorial_map", "assets/tiledata/tutorial.tmj");
    this.load.spritesheet("player", "assets/img/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });
  }

  public create() {
    // map
    /**
		 note - arguments are weird:
		 tilemap.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		 */
    const tutorialTilemap = this.make.tilemap({ key: "tutorial_map" });
    tutorialTilemap.addTilesetImage("Lofi Pastels", "tiles");
    for (let i = 0; i < tutorialTilemap.layers.length; i++) {
      const layer = tutorialTilemap.createLayer(i, "Lofi Pastels", 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }

    // player
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    // grid movment
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 8, y: 8 },
        },
      ],
    };

    this.gridEngine.create(tutorialTilemap, gridEngineConfig);
  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move("player", "left"); // works despite error msg
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
  }
}
