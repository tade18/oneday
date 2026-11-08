import { CONFIG, BUILDINGS } from "./config.js";

export class Renderer {
  constructor(canvas, grid, resourceManager, population) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.grid = grid;
    this.resources = resourceManager;
    this.population = population;

    this.cellSize = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.selectedBuilding = "road";
    this.buttons = [];
    this.floatingTexts = [];

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  }

  setSelectedBuilding(buildingId) {
    this.selectedBuilding = buildingId;
    this.draw();
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
    const availableHeight =
      CONFIG.BASE_HEIGHT - CONFIG.UI_HEIGHT - CONFIG.GRID_PADDING * 2;

    this.cellSize = Math.floor(
      Math.min(
        availableWidth / this.grid.cols,
        availableHeight / this.grid.rows,
      ),
    );

    const gridWidth = this.cellSize * this.grid.cols;
    const gridHeight = this.cellSize * this.grid.rows;

    this.offsetX = Math.floor((CONFIG.BASE_WIDTH - gridWidth) / 2);
    this.offsetY =
      CONFIG.UI_HEIGHT +
      Math.floor((CONFIG.BASE_HEIGHT - CONFIG.UI_HEIGHT - gridHeight) / 2);
  }

  draw() {
    const ctx = this.ctx;

    // 1. Background
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

    // 2. Grid
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const x = this.offsetX + col * this.cellSize;
        const y = this.offsetY + row * this.cellSize;
        const buildingId = this.grid.getCell(col, row);

        if (buildingId && BUILDINGS[buildingId]) {
          ctx.fillStyle = BUILDINGS[buildingId].color;
        } else {
          ctx.fillStyle = CONFIG.COLORS.cellEmpty;
        }

        ctx.fillRect(x, y, this.cellSize, this.cellSize);

        ctx.strokeStyle = CONFIG.COLORS.cellBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }

    // 3. UI
    this.drawUI();

    // 4. Floating texts (MUST be last so they are on top)
    this.drawFloatingTexts();
  }

  drawUI() {
    const ctx = this.ctx;
    this.buttons = [];

    // UI background
    ctx.fillStyle = CONFIG.COLORS.uiBackground;
    ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.UI_HEIGHT);

    ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, CONFIG.UI_HEIGHT);
    ctx.lineTo(CONFIG.BASE_WIDTH, CONFIG.UI_HEIGHT);
    ctx.stroke();

    // Resources + population
    const res = this.resources.getAll();
    const pop = this.population ? this.population.count : 0;

    const resourceText = `Credits: ${Math.floor(res.credits)}   Energy: ${Math.floor(res.energy)}   Material: ${Math.floor(res.material)}   Organics: ${Math.floor(res.organics)}   Pop: ${pop}`;

    ctx.fillStyle = CONFIG.COLORS.resource;
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(resourceText, 16, 22);

    // Building buttons
    const buildingList = Object.values(BUILDINGS);
    let x = 16;
    const y = 38;

    ctx.font = "13px system-ui";

    buildingList.forEach((building) => {
      const label = building.name;
      const textWidth = ctx.measureText(label).width;
      const buttonWidth = Math.max(90, textWidth + 20);

      const isActive = this.selectedBuilding === building.id;
      const canAfford = this.resources.canAfford(building.cost);

      ctx.fillStyle = isActive
        ? CONFIG.COLORS.buttonActive
        : CONFIG.COLORS.button;
      ctx.fillRect(x, y, buttonWidth, CONFIG.BUTTON_HEIGHT - 6);

      ctx.strokeStyle = isActive
        ? CONFIG.COLORS.buttonActiveBorder
        : CONFIG.COLORS.uiBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, buttonWidth, CONFIG.BUTTON_HEIGHT - 6);

      ctx.fillStyle = canAfford
        ? isActive
          ? "#ffffff"
          : CONFIG.COLORS.textHighlight
        : "#555";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        label,
        x + buttonWidth / 2,
        y + (CONFIG.BUTTON_HEIGHT - 6) / 2,
      );

      this.buttons.push({
        id: building.id,
        x,
        y,
        width: buttonWidth,
        height: CONFIG.BUTTON_HEIGHT - 6,
      });

      x += buttonWidth + CONFIG.BUTTON_PADDING;
    });
  }

  drawFloatingTexts() {
    const ctx = this.ctx;

    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.fillStyle = ft.positive
        ? CONFIG.COLORS.floatingPositive
        : CONFIG.COLORS.floatingNegative;
      ctx.font = "bold 18px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.globalAlpha = 1;
  }

  updateFloatingTexts(deltaSeconds) {
    for (const ft of this.floatingTexts) {
      ft.y += ft.vy * deltaSeconds;
      ft.life -= deltaSeconds * 0.6;
    }

    this.floatingTexts = this.floatingTexts.filter((ft) => ft.life > 0);
  }

  addFloatingText(x, y, text, positive = true) {
    this.floatingTexts.push({
      x,
      y,
      text,
      positive,
      life: 1.6,
      vy: -35,
    });
  }

  getLogicalPos(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CONFIG.BASE_WIDTH / rect.width;
    const scaleY = CONFIG.BASE_HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  getCellFromMouse(clientX, clientY) {
    const { x, y } = this.getLogicalPos(clientX, clientY);

    const col = Math.floor((x - this.offsetX) / this.cellSize);
    const row = Math.floor((y - this.offsetY) / this.cellSize);

    if (this.grid.isValid(col, row)) {
      return { col, row };
    }
    return null;
  }

  getButtonFromMouse(clientX, clientY) {
    const { x, y } = this.getLogicalPos(clientX, clientY);

    for (const btn of this.buttons) {
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        return btn.id;
      }
    }
    return null;
  }
}
