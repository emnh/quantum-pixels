const lib = require('./lib.js');
const run = function(state) {
  console.log('Div');

  const len = state.data.length / lib.colors;
  const colorData = new Float32Array(len * lib.colors);

  const rnd = () => Math.random();

  const rect = {
    x: 0,
    y: 0,
    w: lib.width,
    h: lib.height,
    color: [rnd(), rnd(), rnd()]
  };

  const q = [rect];

  const rects = [];

  const process = (r) => {
    if (r1.w > 0 && r1.h > 0) {
      q.push(r1);
    }
  };

  while (q.length > 0) {
    const top = q.pop();
    rects.push(top);

    const xmid = Math.floor(top.x + rnd() * top.width);
    const ymid = Math.floor(top.y + rnd() * top.height);

    const nr1 = {
      x: top.x,
      y: top.y,
      w: xmid - top.x,
      h: ymid - top.y,
      color: [rnd(), rnd(), rnd()]
    };
    const nr2 = {
      x: xmid,
      y: top.y,
      w: top.width - nr1.w,
      h: ymid - top.y,
      color: [rnd(), rnd(), rnd()]
    };
    const nr3 = {
      x: top.x,
      y: ymid,
      w: xmid - top.x,
      h: top.height - nr1.h,
      color: [rnd(), rnd(), rnd()]
    };
    const nr4 = {
      x: xmid,
      y: ymid,
      w: nr3.w,
      h: nr2.h,
      color: [rnd(), rnd(), rnd()]
    };
    process(nr1);
    process(nr2);
    process(nr3);
    process(nr4);
  }

  const f2 = (x, y) => {
    const r = colorData[(y * lib.height + x) * lib.colors + 0];
    const g = colorData[(y * lib.height + x) * lib.colors + 1];
    const b = colorData[(y * lib.height + x) * lib.colors + 2];
    return [r, g, b];
  };
  lib.initialize(state, f2);
};
