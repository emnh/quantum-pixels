const $ = require('jquery');
const TinyQueue = require('tinyqueue');
const gpu = require('gpu.js');

const lib = require('./lib.js');

const state = lib.setup();
//lib.randomize(state);
require('./matrix.js').randMult(state);
lib.showImage(state);
