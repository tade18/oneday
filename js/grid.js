import { CONFIG } from './config.js';

export class Grid {
  constructor() {
    this.cols = CONFIG.GRID_COLS;
    this.rows = CONFIG.GRID_ROWS;

    // 0 = empty, 1 = selected
    this.cells = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(0)
    );
  }

  toggleCell(col, row) {
    if (this.isValid(col, row)) {
      this.cells[row][col] = this.cells[row][col] === 0 ? 1 : 0;
      return true;
    }
    return false;
  }

  getCell(col, row) {
    if (this.isValid(col, row)) {
      return this.cells[row][col];
    }
    return null;
  }

  isValid(col, row) {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }
}