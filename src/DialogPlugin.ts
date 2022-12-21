export default class DialogPlugin extends Phaser.Plugins.ScenePlugin {
  borderThickness: number;
  borderColor: any;
  borderAlpha: any;
  windowAlpha: any;
  windowColor: any;
  windowHeight: number;
  padding: number;
  closeBtnColor: any;
  dialogSpeed: any;
  eventCounter: number;
  visible: boolean;
  text: any;
  dialog: any;
  graphics: Phaser.GameObjects.Graphics;
  closeBtn: any;
  depth: number;

  constructor(scene, pluginManager, pluginKey) {
    super(scene, pluginManager, pluginKey);

    /*    

		TODO - block commented parts aren't working - look into prototypes & inheritance

		// called when the plugin is loaded by the PluginManager
    const eventEmitter = this.systems.events;
    console.log("eventemitter?", eventEmitter);
    eventEmitter.on("shutdown", this.shutdown, this);
    eventEmitter.on("destroy", this.destroy, this); */
  }

  /* 
  //  Called when a Scene shuts down, it may then come back again later
  // (which will invoke the 'start' event) but should be considered dormant.
  private shutdown() {
    if (this.text) this.text.destroy();
    console.log("SHUT DOWN!!!");
  }

  // called when a Scene is destroyed by the Scene Manager
  private destroy() {
    this.shutdown();
    this.scene = undefined;
    console.log("DESTROYED!!!");
  } */

  public init(opts?) {
    if (!opts) opts = {};
    // set properties from opts object or use defaults
    this.borderThickness = opts.borderThickness || 3;
    this.borderColor = opts.borderColor || 0xffffff;
    this.borderAlpha = opts.borderAlpha || 1;
    this.windowAlpha = opts.windowAlpha || 0.8;
    this.windowColor = opts.windowColor || 0x303030;
    this.windowHeight =
      opts.windowHeight || this.systems.game.canvas.height / 3;
    this.padding = opts.padding || 64;
    this.closeBtnColor = opts.closeBtnColor || this.borderColor;
    this.dialogSpeed = opts.dialogSpeed || 3;
    this.depth = opts.depth || 10;

    // used for animating the text
    this.eventCounter = 0;
    // if the dialog window is shown
    this.visible = true;
    // the current text in the window
    this.text;
    // the text that will be displayed in the window
    this.dialog;
    this.graphics = this.scene.add.graphics();
    this.closeBtn;

    // Create the dialog window
    this._createWindow();
  }

  // Gets the width of the game (based on the scene)
  private _getGameWidth(): number {
    return this.scene.sys.game.config.width as number;
  }

  // Gets the height of the game (based on the scene)
  private _getGameHeight(): number {
    return this.scene.sys.game.config.height as number;
  }

  // Calculates where to place the dialog window based on the game size
  private _calculateWindowDimensions(width, height) {
    var x = this.padding;
    var y = height - this.windowHeight - this.padding;
    var rectWidth = width - this.padding * 2;
    var rectHeight = this.windowHeight;
    return {
      x,
      y,
      rectWidth,
      rectHeight,
    };
  }

  // Creates the inner dialog window (where the text is displayed)
  private _createInnerWindow(x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics
      .fillRoundedRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1)
      .setDepth(this.depth);
  }

  // Creates the border rectangle of the dialog window
  private _createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(
      this.borderThickness,
      this.borderColor,
      this.borderAlpha
    );
    this.graphics
      .strokeRoundedRect(x, y, rectWidth, rectHeight)
      .setDepth(this.depth);
  }

  // Hide/Show the dialog window
  public toggleWindow() {
    this.visible = !this.visible;
    if (this.text) this.text.visible = this.visible;
    if (this.graphics) this.graphics.visible = this.visible;
    if (this.closeBtn) this.closeBtn.visible = this.visible;
  }

  // Sets the text for the dialog window
  public setText(text) {
    this._setText(text);
  }

  // Calcuate the position of the text in the dialog window
  private _setText(text) {
    console.log("THIS IS WHAT YOU SAID!!!\n", text);
    // Reset the dialog
    // if (this.text) this.text.destroy();
    var x = this.padding + 24;
    var y = this._getGameHeight() - this.windowHeight - this.padding + 20;
    this.text = this.scene.make.text({
      x,
      y,
      text,
      style: {
        fontSize: "24px",
        wordWrap: { width: this._getGameWidth() - this.padding * 2 - 25 },
      },
    });
    this.text.setDepth(this.depth + 1);
  }

  // Creates the close dialog window button
  private _createCloseModalButton() {
    const self = this;
    this.closeBtn = this.scene.make.text({
      x: this._getGameWidth() - this.padding - 20,
      y: this._getGameHeight() - this.windowHeight - this.padding + 10,
      text: "X",
      style: {
        font: "bold 12px Arial",
      },
    });
    this.closeBtn.setFill(this.closeBtnColor);
    this.closeBtn.setDepth(this.depth + 1);
    this.closeBtn.setInteractive();
    this.closeBtn.on("pointerover", function () {
      this.setTintFill(0xff0000);
    });
    this.closeBtn.on("pointerout", function () {
      this.clearTint();
    });
    this.closeBtn.on("pointerdown", function () {
      self.toggleWindow();
      // if (self.text) {
      //   self.text.destroy();
      //   console.log("destroyed?", self.text);
      // }
    });
  }

  // // Creates the close dialog button border
  // private _createCloseModalButtonBorder() {
  //   var x = this._getGameWidth() - this.padding - 20;
  //   var y = this._getGameHeight() - this.windowHeight - this.padding;
  //   this.graphics.strokeRoundedRect(x, y, 20, 20);
  // }

  // Creates the dialog window
  private _createWindow() {
    var gameHeight = this._getGameHeight();
    var gameWidth = this._getGameWidth();
    var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.scene.add.graphics();
    this._createOuterWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight
    );
    this._createInnerWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight
    );
    this._createCloseModalButton();
  }
}
