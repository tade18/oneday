import { Grid } from './grid.js';
import { Renderer } from './renderer.js';
import { ResourceManager } from './resourceManager.js';

const canvas = document.getElementById('gameCanvas');

const resources = new ResourceManager();
const grid = new Grid();
const renderer = new Renderer(canvas, grid, resources);

renderer.resize();

canvas.addEventListener('click', (e) => {
  // UI button click
  const buttonId = renderer.getButtonFromMouse(e.clientX, e.clientY);
  if (buttonId) {
    renderer.setSelectedBuilding(buttonId);
    return;
  }

  // Grid click
  const cell = renderer.getCellFromMouse(e.clientX, e.clientY);
  if (cell) {
    const placed = grid.place(cell.col, cell.row, renderer.selectedBuilding, resources);
    if (placed) {
      renderer.draw(); // redraw to update resources display
    }
  }
});