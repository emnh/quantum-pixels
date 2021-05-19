const $ = require('jquery');
const TinyQueue = require('tinyqueue');

// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<canvas id='canvas'>JS Starter</canvas>`;

const height = 800;
const width = 800;

const canvas = $("#canvas");
canvas[0].width = width;
canvas[0].height = height;
const ctx = canvas[0].getContext('2d');
var myImageData = ctx.createImageData(width, height);

const colors = 4;

const data = myImageData.data;

const f = function(data, i, x, y, rgba) {
  data[(y * height + x) * colors + 0] = rgba.r(i, x, y) * 255;
  data[(y * height + x) * colors + 1] = rgba.g(i, x, y) * 255;
  data[(y * height + x) * colors + 2] = rgba.b(i, x, y) * 255;
  data[(y * height + x) * colors + 3] = rgba.a(i, x, y) * 255;
};

const rgba = function(width, height) {
  const r = (i, x, y) => {
    return terrainColor[i * 4 + 0];
  };

  const g = (i, x, y) => {
    return terrainColor[i * 4 + 1];
  };

  const b = (i, x, y) => {
    //return d[i] / width;
    return terrainColor[i * 4 + 2];
  };

  const a = (i, x, y) => {
    return 1;
  };

  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
};

const d = new Float32Array(data.length / colors);
const seen = new Int32Array(data.length / colors);
const terrainColor = new Float32Array(data.length);

const sx = width / 2;
const sy = height / 2;
const s = sx + sy * height;
const iq = [];
for (let r = 0; r < 1; r++) {
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  const i = r == 0 ? s : x + y * height;
  terrainColor[i * 4 + 0] = Math.random();
  terrainColor[i * 4 + 1] = Math.random();
  terrainColor[i * 4 + 2] = Math.random();
  terrainColor[i * 4 + 3] = Math.random();
  iq.push(i);
}

const fcmp = (a, b) => {
  return d[a] - d[b];
};
const q = new TinyQueue(iq, fcmp); //new Int32Array(data.length * 4 / colors);

const cf = rgba(width, height);

const add = (q, ni) => {
  d[ni] = d[i] + 0.1 * (Math.random() - 0.2);
  const diff = d[ni] - d[i];
  const fx = () => 1.0 * (Math.random() - 0.5) * diff;
  terrainColor[ni * 4 + 0] = terrainColor[i * 4 + 0] + fx();
  terrainColor[ni * 4 + 1] = terrainColor[i * 4 + 1] + fx();
  terrainColor[ni * 4 + 2] = terrainColor[i * 4 + 2] + fx();
  terrainColor[ni * 4 + 3] = terrainColor[i * 4 + 3] + fx();
  q.push(ni);
};

const neighbours = (q, i, x, y) => {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (Math.abs(dx) + Math.abs(dy) != 1) {
        continue;
      }
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const ni = nx + ny * height;
        if (seen[ni] === 0) {
          add(q, ni);
        }
      }
    }
  }
};

let qi = 0;
let qj = 1;
while (q.length > 0) {
  const i = q.pop();

  if (seen[i] !== 0) {
    continue;
  }
  seen[i] = 1;
  
  const x = i % height;
  const y = Math.floor(i / height);
  f(data, i, x, y, cf);

  /*
  const dd = 5;
  for (let dx = -dd; dx <= dd; dx++) {
    for (let dy = -dd; dy <= dd; dy++) {
      const dxy = Math.sqrt(dx * dx + dy * dy);
      if (dxy <= dd) {
        const nx = x + dx;
        const ny = y + dy;
        const ni = nx + ny * height;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const diff = d[ni] - d[i];
          const gx = () => 10.0 * (Math.random() - 0.5) * diff;
          terrainColor[ni * 4 + 0] = terrainColor[i * 4 + 0] + gx();
          terrainColor[ni * 4 + 1] = terrainColor[i * 4 + 1] + gx();
          terrainColor[ni * 4 + 2] = terrainColor[i * 4 + 2] + gx();
          terrainColor[ni * 4 + 3] = terrainColor[i * 4 + 3] + gx();
          f(data, ni, nx, ny, cf);
        }
      }
    }
  }

  for (let k = 0; k < 2; k++) {
    const r = 10.0;
    const theta = 2.0 * Math.PI * Math.random();
    const rx = Math.floor(x + r * Math.cos(theta));
    const ry = Math.floor(y + r * Math.sin(theta));
    const ni = rx + ry * height;
    if (seen[ni] === 0) {
      add(q, ni);
    }
  }*/
  
  {
    neighbours(q, i, x, y);
  }
}

ctx.putImageData(myImageData, 0, 0);