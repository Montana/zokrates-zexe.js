const compile = require('./lib/compile');
const computeWitness = require('./lib/compute-witness');
const extractVk = require('./lib/extract-vk');
const generateProof = require('./lib/generate-proof');
const setup = require('./lib/setup');

module.exports = {
  compile,
  computeWitness,
  extractVk,
  generateProof,
  setup,
};
