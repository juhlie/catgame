import "phaser";
import { GridEngine } from "grid-engine";
import TutorialScene from "./TutorialScene";

export enum Canvas {
  Width = 1000,
  Height = 864,
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scale: {
    width: Canvas.Width,
    height: Canvas.Height,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scene: [TutorialScene],
};

export default new Phaser.Game(gameConfig);
