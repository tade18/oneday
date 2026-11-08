import { CONFIG, BUILDINGS } from './config.js';

export class Population {
  constructor() {
    this.count = 0;
  }

  recalculate(grid) {
    let total = 0;

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const id = grid.getCell(col, row);
        if (id && BUILDINGS[id]) {
          total += BUILDINGS[id].population || 0;
        }
      }
    }

    this.count = total;
  }

  getFoodConsumption() {
    return this.count * CONFIG.FOOD_PER_CITIZEN;
  }
}