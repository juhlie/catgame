import Player from "./Player";
import GridControls from "./GridControls";
import GridPhysics from "./GridPhysics";
import { Direction } from "./Direction";

export default class Hewwo extends Phaser.Scene {
  static readonly TILE_SIZE = 48;
  private gridControls: GridControls;
  private gridPhysics: GridPhysics;

  public preload() {
    this.load.image("tiles", "assets/cloud_tileset.png");
    this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud-city.json.tmj");
    this.load.spritesheet("player", "assets/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });
  }

  public create() {
    // map
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }

    // player
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite);
    const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

    // controls
    this.gridPhysics = new GridPhysics(player, cloudCityTilemap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    // animations
    this.createPlayerAnimation(Direction.UP, 90, 92);
    this.createPlayerAnimation(Direction.RIGHT, 78, 80);
    this.createPlayerAnimation(Direction.DOWN, 54, 56);
    this.createPlayerAnimation(Direction.LEFT, 66, 68);

    // collisions
  }

  public update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
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
}
