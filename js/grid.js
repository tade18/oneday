import { CONFIG, BUILDINGS } from './config.js';

export class Grid {
  constructor() {
    this.cols = CONFIG.GRID_COLS;
    this.rows = CONFIG.GRID_ROWS;

    // null = empty, otherwise building id
    this.cells = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
  }

  getCell(col, row) {
    if (!this.isValid(col, row)) return null;
    return this.cells[row][col];
  }

  isValid(col, row) {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  isAdjacentToRoad(col, row) {
    const directions = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0]
    ];

    for (const [dx, dy] of directions) {
      const nCol = col + dx;
      const nRow = row + dy;

      if (this.isValid(nCol, nRow) && this.cells[nRow][nCol] === 'road') {
        return true;
      }
    }
    return false;
  }

  canPlace(col, row, buildingId, resourceManager) {
    if (!this.isValid(col, row)) return false;
    if (this.cells[row][col] !== null) return false;

    const building = BUILDINGS[buildingId];
    if (!building) return false;

    // Must be adjacent to road (except roads themselves)
    if (building.requiresRoad && !this.isAdjacentToRoad(col, row)) {
      return false;
    }

    // Check resources
    if (resourceManager && !resourceManager.canAfford(building.cost)) {
      return false;
    }

    return true;
  }

  place(col, row, buildingId, resourceManager) {
    if (!this.canPlace(col, row, buildingId, resourceManager)) {
      return false;
    }

    const building = BUILDINGS[buildingId];

    // Spend resources
    if (resourceManager && building.cost) {
      resourceManager.spend(building.cost);
    }

    this.cells[row][col] = buildingId;
    return true;
  }

  clear(col, row) {
    if (this.isValid(col, row)) {
      this.cells[row][col] = null;
      return true;
    }
    return false;
  }
}