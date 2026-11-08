export const CONFIG = {
  // Canvas
  ASPECT_RATIO: 16 / 9,
  BASE_WIDTH: 1280,

  // Grid
  GRID_COLS: 16,
  GRID_ROWS: 9,
  GRID_PADDING: 40,

  // UI
  UI_HEIGHT: 70,
  BUTTON_HEIGHT: 36,
  BUTTON_PADDING: 8,

  // Colors
  COLORS: {
    background: '#111118',
    cellEmpty: '#1c1c24',
    cellBorder: '#2a2a35',
    text: '#888',
    textHighlight: '#e0e0e0',
    uiBackground: '#16161e',
    uiBorder: '#2a2a35',
    button: '#1c1c24',
    buttonActive: '#2e4a3e',
    buttonActiveBorder: '#4a7c59',
    resource: '#a0a0b0'
  },

  // Starting resources
  STARTING_RESOURCES: {
    credits: 500,
    energy: 100,
    material: 200,
    organics: 50
  }
};

CONFIG.BASE_HEIGHT = Math.round(CONFIG.BASE_WIDTH / CONFIG.ASPECT_RATIO);

// Building definitions
export const BUILDINGS = {
  road: {
    id: 'road',
    name: 'Road',
    color: '#555566',
    requiresRoad: false,
    cost: { credits: 5, material: 10 }
  },
  house: {
    id: 'house',
    name: 'Habitat',
    color: '#4a7c59',
    requiresRoad: true,
    cost: { credits: 40, material: 30, energy: 5 }
  },
  solar: {
    id: 'solar',
    name: 'Solar Plant',
    color: '#c9a227',
    requiresRoad: true,
    cost: { credits: 50, material: 40 }
  },
  mine: {
    id: 'mine',
    name: 'Mine',
    color: '#8b5e3c',
    requiresRoad: true,
    cost: { credits: 60, material: 20, energy: 10 }
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Greenhouse',
    color: '#3d8b6e',
    requiresRoad: true,
    cost: { credits: 45, material: 25, energy: 8 }
  }
};