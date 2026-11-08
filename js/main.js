const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// === aspect ratio ===
const ASPECT_RATIO = 16 / 9;   // sirokouhly
// const ASPECT_RATIO = 4 / 3; // 4:3
// const ASPECT_RATIO = 16 / 10; // 16:10

// canvas res
const BASE_WIDTH = 1280;
const BASE_HEIGHT = Math.round(BASE_WIDTH / ASPECT_RATIO);

function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let width = windowWidth;
  let height = width / ASPECT_RATIO;

  if (height > windowHeight) {
    height = windowHeight;
    width = height * ASPECT_RATIO;
  }

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = BASE_WIDTH * dpr;
  canvas.height = BASE_HEIGHT * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- test ---
function draw() {
  // background
  ctx.fillStyle = '#111118';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  // frame
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, BASE_WIDTH - 40, BASE_HEIGHT - 40);

  // text
  ctx.fillStyle = '#e0e0e0';
  ctx.font = '32px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('One Day – Canvas OK', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 20);

  ctx.font = '18px system-ui';
  ctx.fillStyle = '#888';
  ctx.fillText(`${BASE_WIDTH} × ${BASE_HEIGHT} (logické rozlišení)`, BASE_WIDTH / 2, BASE_HEIGHT / 2 + 20);
}

draw();