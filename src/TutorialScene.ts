import { GridEngine } from "grid-engine";
import DialogPlugin from "./DialogPlugin";

export default class TutorialScene extends Phaser.Scene {
  gridEngine: GridEngine;
  dialogPlugin: DialogPlugin;

  public preload() {
    this.load.image("tiles", "assets/img/lofi_pastels.png");
    this.load.tilemapTiledJSON("tutorial_map", "assets/tiledata/tutorial.tmj");

    this.load.spritesheet("player", "assets/img/pipo-nekonin005.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("agent", "assets/img/pipo-nekonin010.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  public create() {
    // create map
    /**
		 note - parameters are weird:
		 tilemap.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		 */
    const tutorialTilemap = this.make.tilemap({ key: "tutorial_map" });
    tutorialTilemap.addTilesetImage("Lofi Pastels", "tiles");
    const mapScale = 3;
    for (let i = 0; i < tutorialTilemap.layers.length; i++) {
      const layer = tutorialTilemap.createLayer(i, "Lofi Pastels", 0, 0);
      layer.setDepth(i);
      layer.scale = mapScale;
    }

    // player setup
    const [playerSprite, container] = this.createSpriteWithContainer.call(
      this,
      "player"
    );
    playerSprite.setFrame(this.getStopFrame("right"));
    this.createPlayerAnimation.call(this, "up", 9, 11);
    this.createPlayerAnimation.call(this, "right", 6, 8);
    this.createPlayerAnimation.call(this, "down", 0, 2);
    this.createPlayerAnimation.call(this, "left", 3, 5);

    // camera position
    this.cameras.main.setBounds(
      0,
      0,
      tutorialTilemap.widthInPixels * mapScale,
      tutorialTilemap.heightInPixels * mapScale
    );
    this.cameras.main.startFollow(container, true, 1, 0);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    // npc agent setup
    const [agentSprite, agentContainer] = this.createSpriteWithContainer.call(
      this,
      "agent"
    );
    agentSprite.setDepth(playerSprite.depth);
    agentSprite.setFrame(this.getStopFrame("up"));

    // grid movement
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 3, y: 7 },
          container: container,
          collides: {
            collisionGroups: ["npc"],
          },
        },
        {
          id: "agent",
          sprite: agentSprite,
          startPosition: { x: 7, y: 12 },
          container: agentContainer,
          collides: {
            collisionGroups: ["npc"],
          },
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

    // testing dialog plugin
    this.dialogPlugin.init();
    this.dialogPlugin.setText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );
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

  private createSpriteWithContainer(spriteID: string) {
    const sprite = this.add.sprite(0, 0, spriteID).setScale(2.5);
    const container = this.add.container(0, 0, [sprite]);
    return [sprite, container];
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
