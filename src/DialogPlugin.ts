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
  }

  public init(opts?) {
    if (!opts) opts = {};
    // set properties from opts object or use defaults
    this.borderThickness = opts.borderThickness || 3;
    this.borderColor = opts.borderColor || 0x907748;
    this.borderAlpha = opts.borderAlpha || 1;
    this.windowAlpha = opts.windowAlpha || 0.8;
    this.windowColor = opts.windowColor || 0x303030;
    this.windowHeight = opts.windowHeight || 150;
    this.padding = opts.padding || 32;
    this.closeBtnColor = opts.closeBtnColor || "darkgoldenrod";
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
  private _getGameWidth() {
    return this.scene.sys.game.config.width;
  }

  // Gets the height of the game (based on the scene)
  private _getGameHeight() {
    return this.scene.sys.game.config.height;
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
      .fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1)
      .setDepth(this.depth);
  }

  // Creates the border rectangle of the dialog window
  private _createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(
      this.borderThickness,
      this.borderColor,
      this.borderAlpha
    );
    this.graphics.strokeRect(x, y, rectWidth, rectHeight).setDepth(this.depth);
  }

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
  }
}
