const quantumRand = function() {
  const imax = 8;
  let gridColor1 = new Float32Array((data.length / colors) * imax);
  let gridColor2 = new Float32Array((data.length / colors) * imax);

  const w = width;
  const h = height;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      for (let i = 0; i < imax; i++) {
        const ix = (y * height + x) * imax + i;
        gridColor1[ix] = Math.random();
      }
    }
  }

  const maxiter = 10;
  for (let iter = 0; iter < maxiter; iter++) {
    console.log('iter', iter);
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const tx = y * height + x;
        for (let i = 0; i < imax; i++) {
          const ix = (y * height + x) * imax + i;
          if (gridColor1[ix] >= 0.0) {
            let prob = 0.0;
            let count = 0;
            //let nearest = 1.0;
            let nearest = 0.8;
            for (let ni = 0; ni < imax; ni++) {
              for (let nbi = 0; nbi < nbs.length; nbi++) {
                const [dx, dy] = nbs[nbi];
                const nx = x + dx;
                const ny = y + dy;
                const cur = gridColor1[ix];
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const ix2 = (ny * height + nx) * imax + ni;
                  if (gridColor1[ix2] >= 0.0) {
                    nearest = Math.min(Math.abs(cur - gridColor1[ix2]), nearest);
                    //prob += Math.abs(cur - gridColor1[ix2]);
                    count++;
                  }
                }
              }
            }
            //prob = 1.0 - prob / count;
            prob = 1.0 - nearest;
            //console.log(prob);

            if (Math.random() <= prob || iter == 0) {
              // survives
              gridColor2[ix] = gridColor1[ix];
              put(x, y, tx, (x, y, i, rgb) => gridColor1[ix]);
              //console.log(gridColor1[ix], terrainColor[tx]);
            } else {
              gridColor2[ix] = -1.0;
            }
          }
        }
      }
    }
    let gridColor3 = gridColor2;
    gridColor2 = gridColor1;
    gridColor1 = gridColor3;
  }

};
