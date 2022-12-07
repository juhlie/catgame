import "phaser";
import Hewwo from "./HewwoScene";

enum Canvas {
  Width = 720,
  Height = 528,
}

const config: Phaser.Types.Core.GameConfig = {
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scale: {
    width: Canvas.Width,
    height: Canvas.Height,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Hewwo],
};

export default new Phaser.Game(config);
