export const CONFIG = {
  // canvas
  ASPECT_RATIO: 16 / 9,
  BASE_WIDTH: 1280,

  // grid
  GRID_COLS: 16,
  GRID_ROWS: 9,
  GRID_PADDING: 40,

  // colors
  COLORS: {
    background: '#111118',
    cellEmpty: '#1c1c24',
    cellSelected: '#3a7e4c',
    cellBorder: '#2a2a35',
    text: '#666'
  }
};

CONFIG.BASE_HEIGHT = Math.round(CONFIG.BASE_WIDTH / CONFIG.ASPECT_RATIO);