const { performance } = require('./runtime');
const { getMemoryUsage, formatMemory } = require('./memory');
const { BENCHMARK_CONFIG } = require('../config');

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate median value
const getMedian = (values) => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Run a benchmark
const benchmark = async (name, fn, iteration) => {
  const isVerbose = iteration % BENCHMARK_CONFIG.sampleEvery === 0;

  if (isVerbose) {
    console.log(`\n----- Running benchmark: ${name} (Iteration ${iteration + 1}/${BENCHMARK_CONFIG.iterations}) -----`);
  }

  // Record starting memory
  const startMemory = getMemoryUsage();
  if (isVerbose) {
    console.log('Starting memory usage:', formatMemory(startMemory));
  }

  // Run the benchmark
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Record ending memory
  const endMemory = getMemoryUsage();
  if (isVerbose) {
    console.log('Ending memory usage:', formatMemory(endMemory));
  }

  // Calculate memory difference
  const memoryDifference = {
    rss: endMemory.rss - startMemory.rss,
    heapTotal: endMemory.heapTotal - startMemory.heapTotal,
    heapUsed: endMemory.heapUsed - startMemory.heapUsed,
    external: endMemory.external - startMemory.external
  };

  if (isVerbose) {
    console.log('Memory difference:', formatMemory(memoryDifference));
    console.log(`Execution time: ${executionTime.toFixed(2)} ms`);

    if (result) {
      console.log('Result:', result);
    }
  }

  // Return benchmark data
  return {
    name,
    executionTime,
    startMemory,
    endMemory,
    memoryDifference,
    result: result || null
  };
};

module.exports = {
  sleep,
  getMedian,
  benchmark
};
