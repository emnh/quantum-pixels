const $ = require('jquery');

const height = 200;
const width = 200;
const colors = 4;

const neighbours4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const neighbours9 = [];
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    neighbours9.push([x, y]);
  }
}

const clamp = (x, a, b) => {
  return Math.min(Math.max(x, a), b);
};

const setup = function() {
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = `<canvas id='canvas'>Placeholder</canvas>`;

  const canvas = $('#canvas');
  canvas[0].width = width;
  canvas[0].height = height;
  const ctx = canvas[0].getContext('2d');
  const myImageData = ctx.createImageData(width, height);

  const data = myImageData.data;

  console.log('Finished setup');

  return {
    ctx,
    myImageData,
    data
  };
};

const initialize = function(state, f) {
  const data = state.data;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * height + x) * colors;
      const [r, g, b] = f(x, y);
      data[i + 0] = clamp(r, 0, 1) * 255;
      data[i + 1] = clamp(g, 0, 1) * 255;
      data[i + 2] = clamp(b, 0, 1) * 255;
      data[i + 3] = 255.0;
    }
  }
};

const randomize = function(state) {
  const r = () => Math.random();
  initialize(state, (x, y) => [r(), r(), r()]);
};

const misc = function() {
  const d = new Float32Array(data.length / colors);
  const seen = new Int32Array(data.length / colors);
  const terrainColor = new Float32Array(data.length);
  console.log((data.length / 4) * 256);

  const put = (x, y, i, fx) => {
    terrainColor[i * 4 + 0] = clamp(fx(x, y, i, 0) * 255, 0, 255);
    terrainColor[i * 4 + 1] = clamp(fx(x, y, i, 1) * 255, 0, 255);
    terrainColor[i * 4 + 2] = clamp(fx(x, y, i, 2) * 255, 0, 255);
    terrainColor[i * 4 + 3] = clamp(fx(x, y, i, 3) * 255, 0, 255);
  };

  const fx = (x, y, i, rgb) => {
    const xf = x / w;
    const yf = y / h;
    return Math.sin(2.0 * Math.PI * xf) + Math.sin(2.0 * Math.PI * yf);
  };
};

const showImage = function(state) {
  state.ctx.putImageData(state.myImageData, 0, 0);
  console.log("Showed image");
};

module.exports = {
  setup,
  clamp,
  height,
  width,
  neighbours4,
  neighbours9,
  showImage,
  randomize,
  initialize,
  misc
};
