const $ = require('jquery');
const TinyQueue = require('tinyqueue');
const gpu = require('gpu.js');

const lib = require('./lib.js');

const data = lib.setup();
lib.randomize(data);
lib.showImage(data);
