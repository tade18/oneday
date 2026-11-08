import { Grid } from './grid.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('gameCanvas');

const grid = new Grid();
const renderer = new Renderer(canvas, grid);

renderer.resize();

canvas.addEventListener('click', (e) => {
  const { col, row } = renderer.getCellFromMouse(e.clientX, e.clientY);

  if (grid.toggleCell(col, row)) {
    renderer.draw();
  }
});