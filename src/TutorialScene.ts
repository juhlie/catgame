import { GridEngine } from "grid-engine";

export default class TutorialScene extends Phaser.Scene {
  gridEngine: GridEngine; // does nothing, but gets rid of error message (?)

  public preload() {
    this.load.image("tiles", "assets/img/lofi_pastels.png");
    this.load.tilemapTiledJSON("tutorial_map", "assets/tiledata/tutorial.tmj");
    this.load.spritesheet("player", "assets/img/pipo-nekonin005.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  public create() {
    // map
    /**
		 note - parameters are weird:
		 tilemap.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		 */
    const tutorialTilemap = this.make.tilemap({ key: "tutorial_map" });
    tutorialTilemap.addTilesetImage("Lofi Pastels", "tiles");
    for (let i = 0; i < tutorialTilemap.layers.length; i++) {
      const layer = tutorialTilemap.createLayer(i, "Lofi Pastels", 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }

    // player setup
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 2.5;
    playerSprite.setFrame(this.getStopFrame("right"));
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    // player walking animations
    this.createPlayerAnimation.call(this, "up", 9, 11);
    this.createPlayerAnimation.call(this, "right", 6, 8);
    this.createPlayerAnimation.call(this, "down", 0, 2);
    this.createPlayerAnimation.call(this, "left", 3, 5);

    // grid movement
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 3, y: 7 },
        },
      ],
    };
    this.gridEngine.create(tutorialTilemap, gridEngineConfig);

    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      playerSprite.anims.play(direction);
    });
    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      playerSprite.anims.stop();
      playerSprite.setFrame(this.getStopFrame(direction));
    });
    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      playerSprite.setFrame(this.getStopFrame(direction));
    });
  }

  private createPlayerAnimation(
    name: string,
    startFrame: number,
    endFrame: number
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  private getStopFrame(direction: string) {
    switch (direction) {
      case "up":
        return 10;
      case "right":
        return 7;
      case "down":
        return 1;
      case "left":
        return 4;
    }
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
