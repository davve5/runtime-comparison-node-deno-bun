const { runtime } = require('../config');

// Runtime-specific imports and utilities
const getRuntimeSpecificAPIs = () => {
  let fs, fsPromises, path, crypto, performance;

  if (runtime === 'Node.js') {
    fs = require('fs');
    fsPromises = fs.promises;
    path = require('path');
    crypto = require('crypto');
    performance = require('perf_hooks').performance;
  } else if (runtime === 'Deno') {
    fs = Deno.fs;
    fsPromises = null; // Deno uses different API
    path = { join: (...paths) => paths.join('/') };
    crypto = crypto; // Global in Deno
    performance = self.performance;
  } else if (runtime === 'Bun') {
    fs = Bun.file;
    fsPromises = null; // Bun uses different API
    path = { join: (...paths) => paths.join('/') };
    crypto = crypto; // Global in Bun
    performance = self.performance;
  } else {
    throw new Error('Unsupported runtime');
  }

  return { fs, fsPromises, path, crypto, performance };
};

module.exports = {
  runtime,
  ...getRuntimeSpecificAPIs()
};
