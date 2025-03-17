import { formatMemory, getMemoryUsage } from './memory.js';
import { performance } from './runtime.js';

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMedian = (values) => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const benchmark = async (name, fn, iteration) => {
  const sampleEvery = (globalThis.BENCHMARK_CONFIG?.sampleEvery) || 1;
  const totalIterations = (globalThis.BENCHMARK_CONFIG?.iterations) || 10;

  const isVerbose = false; //iteration % sampleEvery === 0;

  if (isVerbose) {
    console.log(`\n----- Running benchmark: ${name} (Iteration ${iteration + 1}/${totalIterations}) -----`);
  }

  const startMemory = getMemoryUsage();
  if (isVerbose) {
    console.log('Starting memory usage:', formatMemory(startMemory));
  }

  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  const endMemory = getMemoryUsage();
  if (isVerbose) {
    console.log('Ending memory usage:', formatMemory(endMemory));
  }

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

  return {
    name,
    executionTime,
    startMemory,
    endMemory,
    memoryDifference,
    result: result || null
  };
};