const lib = require('./lib.js');
const TinyQueue = require('tinyqueue').default;

const run = function(state) {
  console.log('Aqua');
  const len = state.data.length / lib.colors;
  const colorData = new Float32Array(len * lib.colors);
  const d = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    d[i] = Math.random();
    colorData[i * lib.colors + 0] = Math.random();
    colorData[i * lib.colors + 1] = Math.random();
    colorData[i * lib.colors + 2] = Math.random();
  }
  const cd = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    cd[i] = 0.0;
  }
  const fcmp = (a, b) => cd[a[1] * lib.height + a[0]] - cd[b[1] * lib.height + b[0]];
  const iq = [[lib.width * 0.5, lib.height * 0.5]];
  const q = new TinyQueue(iq, fcmp);
  const seen = new Int32Array(len);
  const parents = new Int32Array(len);

  const f = (x, y, nx, ny) => {
    if (seen[ny * lib.height + nx] == 0) {
      const i = y * lib.height + x;
      const ni = ny * lib.height + nx;
      cd[ni] = cd[i] + d[i];
      parents[ni] = i;
      q.push([nx, ny]);
    }
  };

  const fac = 0.1;
  const rnd = x => (Math.random() - 0.5) * 2.0;
  const g = (p, r) => colorData[p * lib.colors + r] + fac * rnd();

  let qIndex = 0;
  while (q.length > 0) {
    const [x, y] = q.pop();
    const i = y * lib.height + x;
    if (seen[i] != 0) {
      continue;
    }
    seen[i] = 1;

    const p = parents[i];
    if (qIndex > 0) {
      colorData[i * lib.colors + 0] = g(p, 0);
      colorData[i * lib.colors + 1] = g(p, 1);
      colorData[i * lib.colors + 2] = g(p, 2);
    }

    lib.forEachNeighbour4(x, y, f);
    qIndex++;
    if (qIndex % 10 == 0) {
      //console.log(qIndex);
    }
  }
  const f2 = (x, y) => {
    const r = colorData[(y * lib.height + x) * lib.colors + 0];
    const g = colorData[(y * lib.height + x) * lib.colors + 1];
    const b = colorData[(y * lib.height + x) * lib.colors + 2];
    return [r, g, b];
  };
  lib.initialize(state, f2);
};

module.exports = {
  run
};
