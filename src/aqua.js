const lib = require('./lib.js');
const TinyQueue = require('tinyqueue').default;

const run = function(state) {
  console.log('Aqua');
  const len = state.data.length / lib.colors;
  const colors = new Float32Array(len * lib.colors);
  const d = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    d[i] = Math.random();
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

  let qIndex = 0;
  while (q.length > 0) {
    const [x, y] = q.pop();
    const i = y * lib.height + x;
    if (seen[i] != 0) {
      continue;
    }
    seen[i] = 1;

    if (qIndex == 0 || true) {
      colors[i * colors + 0] = Math.random();
      colors[i * colors + 1] = Math.random();
      colors[i * colors + 2] = Math.random();
    } else {
      const p = parents[i];
      const fac = 0.1;
      const g = (r) => colors[p * colors + r] + fac * Math.random();
      colors[i * colors + 0] = g(0);
      colors[i * colors + 1] = g(1);
      colors[i * colors + 2] = g(2);
    }

    lib.forEachNeighbour4(x, y, f);
    qIndex++;
    if (qIndex % 10 == 0) {
      console.log(qIndex);
    }
  }
  const f2 = (x, y) => {
    const r = colors[(y * lib.height + x) * lib.colors + 0];
    const g = colors[(y * lib.height + x) * lib.colors + 1];
    const b = colors[(y * lib.height + x) * lib.colors + 2];
    return [r, g, b];
  };
  lib.initialize(state, f2);
};

module.exports = {
  run
};
