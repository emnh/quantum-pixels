const $ = require('jquery');
const TinyQueue = require('tinyqueue');

// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<canvas id='canvas'>JS Starter</canvas>`;

const height = 800;
const width = 800;

const canvas = $('#canvas');
canvas[0].width = width;
canvas[0].height = height;
const ctx = canvas[0].getContext('2d');
var myImageData = ctx.createImageData(width, height);

const colors = 4;

const data = myImageData.data;

const d = new Float32Array(data.length / colors);
const seen = new Int32Array(data.length / colors);
const terrainColor = new Float32Array(data.length);
console.log((data.length / 4) * 256);
let gridColor1 = new Float32Array((data.length / colors) * 256);
let gridColor2 = new Float32Array((data.length / colors) * 256);

const clamp = (x, a, b) => {
  return Math.min(Math.max(x, a), b);
};

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

const w = width;
const h = height;
const imax = 255;
for (let x = 0; x < w; x++) {
  for (let y = 0; y < h; y++) {
    for (let i = 0; i < imax; i++) {
      gridColor1[i] = i / imax;
    }
  }
}

const nbs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

console.log('hello');

for (let iter = 0; iter < 10; iter++) {
  console.log('iter', iter);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const ix = (y * height + x) * imax;
      const tx = y * height + x;
      for (let i = 0; i < imax; i++) {
        if (gridColor1[ix] >= 0.0) {
          let prob = 0.0;
          for (let nbi = 0; nbi < nbs.length; nbi++) {
            const [dx, dy] = nbs[nbi];
            const nx = x + dx;
            const ny = y + dy;
            const cur = gridColor1[ix];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ix2 = (y * height + x) * imax;
              prob += Math.abs(cur - gridColor1[ix2]);
            }

            if (Math.random() > prob) {
              // survives
              gridColor2[ix] = gridColor1[ix];
              put(x, y, tx, (x, y, i, rgb) => gridColor1[ix]);
              terrainColor[tx] = gridColor1[ix];
            } else {
              gridColor2[ix] = -1.0;
            }
          }
        }
      }
    }
  }
  let gridColor3 = gridColor2;
  gridColor2 = gridColor1;
  gridColor1 = gridColor3;
}

for (let i = 0; i < terrainColor.length; i++) {
  myImageData.data[i] = terrainColor[i];
}
ctx.putImageData(myImageData, 0, 0);
//ctx.putImageData(myImageData, 0, 0);

