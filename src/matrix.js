const lib = require('./lib.js');

const randMult = function(state) {
  const len = state.data.length / lib.colors;
  const array = new Float32Array(len);

	const generateMatrices = () => {
		const matrices = [[], []];
		for (let y = 0; y < lib.height; y++){
			matrices[0].push([]);
			matrices[1].push([]);
			for (let x = 0; x < lib.width; x++){
				matrices[0][y].push(Math.random());
				matrices[1][y].push(Math.random());
			}
		}
		return matrices;
	}

  const gpu = new GPU();
  const settings = {
    constants: {
      width: lib.width,
      height: lib.height
    }
  };
  const multiplyMatrix = gpu.createKernel(function(a, b) {
    let sum = 0;
    for (let i = 0; i < this.constants.width; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  }, settings).setOutput([lib.width, lib.height]);

	const matrices = generateMatrices();
  let a = matrices[0];
  let b = matrices[1];
  for (let i = 0; i < 10; i++) {
    let c = multiplyMatrix(a, b);
    a = c;
  }
  const out = a;
  //const out = multiplyMatrix(matrices[0], matrices[1]);

  let avgMatrix = 0.0;
  let maxMatrix = 0.0;
  let count = lib.width * lib.height;
  lib.forEachMatrix(out, (data, x, y) => {
    maxMatrix = Math.max(out[x][y], maxMatrix);
    avgMatrix += out[x][y];
  });
  avgMatrix /= count;
  lib.forEachMatrix(out, (data, x, y) => {
    //out[x][y] /= maxMatrix;
    //out[x][y] /= avgMatrix;
    out[x][y] = 1 / (1 + Math.exp(-out[x][y]));
  });

	const f = (x, y) => {
    const v = out[x][y];
    return [v, v, v];
  };
	lib.initialize(state, f);
};

module.exports = {
	randMult
};
