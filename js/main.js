import { Grid } from "./grid.js";
import { Renderer } from "./renderer.js";
import { ResourceManager } from "./resourceManager.js";
import { Population } from "./population.js";
import { BUILDINGS, CONFIG } from "./config.js";

const canvas = document.getElementById("gameCanvas");

const resources = new ResourceManager();
const population = new Population();
const grid = new Grid();
const renderer = new Renderer(canvas, grid, resources, population);

renderer.resize();

// ---------- Production tick ----------
function productionTick() {
  const delta = {
    credits: 0,
    energy: 0,
    material: 0,
    organics: 0,
  };

  // 1. Collect production & consumption from all buildings
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const id = grid.getCell(col, row);
      if (!id || !BUILDINGS[id]) continue;

      const b = BUILDINGS[id];

      if (b.production) {
        for (const [key, amount] of Object.entries(b.production)) {
          delta[key] = (delta[key] || 0) + amount;
        }
      }

      if (b.consumption) {
        for (const [key, amount] of Object.entries(b.consumption)) {
          delta[key] = (delta[key] || 0) - amount;
        }
      }
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    renderer.onMouseMove(e.clientX, e.clientY);
  });

  // 2. Population effects
  population.recalculate(grid);

  // Food consumption
  const foodNeeded = population.getFoodConsumption();
  delta.organics -= foodNeeded;

  // Credits from citizens (taxes)
  const creditsFromPop = population.count * CONFIG.CREDITS_PER_CITIZEN;
  delta.credits += creditsFromPop;

  // 3. Apply the delta and get real changes
  const changes = resources.applyDelta(delta);

  // 4. Spawn floating texts
  const centerX = CONFIG.BASE_WIDTH / 2;
  let offsetY = 0;

  for (const [key, amount] of Object.entries(changes)) {
    if (Math.abs(amount) < 0.05) continue;

    const text = (amount > 0 ? "+" : "") + amount.toFixed(1) + " " + key;

    renderer.addFloatingText(
      centerX,
      CONFIG.UI_HEIGHT + 90 + offsetY,
      text,
      amount > 0,
    );

    offsetY += 22;
  }
}

// Start production loop
setInterval(productionTick, CONFIG.TICK_INTERVAL);

// ---------- Click handling ----------
canvas.addEventListener("click", (e) => {
  const buttonId = renderer.getButtonFromMouse(e.clientX, e.clientY);
  if (buttonId) {
    renderer.setSelectedBuilding(buttonId);
    return;
  }

  const cell = renderer.getCellFromMouse(e.clientX, e.clientY);
  if (cell) {
    const placed = grid.place(
      cell.col,
      cell.row,
      renderer.selectedBuilding,
      resources,
    );
    if (placed) {
      population.recalculate(grid);
      renderer.draw();
    }
  }
});

// ---------- Simple animation loop for floating texts ----------
let lastTime = performance.now();

function animate(currentTime) {
  const deltaSeconds = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  renderer.updateFloatingTexts(deltaSeconds);
  renderer.draw();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
