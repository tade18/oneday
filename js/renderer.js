import { CONFIG } from './config.js';

export class Renderer {
  constructor(canvas, grid) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = grid;

    this.cellSize = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let width = windowWidth;
    let height = width / CONFIG.ASPECT_RATIO;

    if (height > windowHeight) {
      height = windowHeight;
      width = height * CONFIG.ASPECT_RATIO;
    }

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = CONFIG.BASE_WIDTH * dpr;
    this.canvas.height = CONFIG.BASE_HEIGHT * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.calculateGridLayout();
    this.draw();
  }

  calculateGridLayout() {
    const availableWidth = CONFIG.BASE_WIDTH - CONFIG.GRID_PADDING * 2;
    const availableHeight = CONFIG.BASE_HEIGHT - CONFIG.GRID_PADDING * 2;

    this.cellSize = Math.floor(Math.min(
      availableWidth / this.grid.cols,
      availableHeight / this.grid.rows
    ));

    const gridWidth = this.cellSize * this.grid.cols;
    const gridHeight = this.cellSize * this.grid.rows;

    this.offsetX = Math.floor((CONFIG.BASE_WIDTH - gridWidth) / 2);
    this.offsetY = Math.floor((CONFIG.BASE_HEIGHT - gridHeight) / 2);
  }

  draw() {
    const ctx = this.ctx;

    // background
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

    // grid
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const x = this.offsetX + col * this.cellSize;
        const y = this.offsetY + row * this.cellSize;

        const value = this.grid.getCell(col, row);

        ctx.fillStyle = value === 1
          ? CONFIG.COLORS.cellSelected
          : CONFIG.COLORS.cellEmpty;

        ctx.fillRect(x, y, this.cellSize, this.cellSize);

        ctx.strokeStyle = CONFIG.COLORS.cellBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }

    // info text
    ctx.fillStyle = CONFIG.COLORS.text;
    ctx.font = '16px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      `Grid: ${this.grid.cols}×${this.grid.rows}`,
      20,
      20
    );
  }

  // mouse pos - grid
  getCellFromMouse(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();

    const scaleX = CONFIG.BASE_WIDTH / rect.width;
    const scaleY = CONFIG.BASE_HEIGHT / rect.height;

    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    const col = Math.floor((mouseX - this.offsetX) / this.cellSize);
    const row = Math.floor((mouseY - this.offsetY) / this.cellSize);

    return { col, row };
  }
}