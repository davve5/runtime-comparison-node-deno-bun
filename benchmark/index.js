import { runCPUBenchmarks } from './benchmarks/cpu.js';
import { runDiskIOBenchmarks } from './benchmarks/disk.js';
import { runMemoryBenchmarks } from './benchmarks/memory.js';
import { BENCHMARK_CONFIG, runtime } from './config.js';
import {
  addIterationResults,
  calculateSummaryStatistics,
  initBenchmarkResults,
  saveResults
} from './results/collector.js';
import { combineResults } from './results/combiner.js';
import { sleep } from './utils/helpers.js';

// Main benchmark runner
const runBenchmarkSuite = async () => {
  // Initialize results object
  const benchmarkResults = initBenchmarkResults();

  // Generate test files once
  // await generateTestFiles();

  // Run benchmarks for multiple iterations
  for (let i = 0; i < BENCHMARK_CONFIG.iterations; i++) {
    console.log(`\n===== STARTING BENCHMARK ITERATION ${i + 1}/${BENCHMARK_CONFIG.iterations} =====`);

    const iterationResults = {
      iteration: i + 1,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Run memory benchmarks
    console.log("\nRunning memory benchmarks...");
    iterationResults.tests.memory = await runMemoryBenchmarks(i);

    // Run disk I/O benchmarks
    console.log("\nRunning disk I/O benchmarks...");
    iterationResults.tests.diskIO = await runDiskIOBenchmarks(i);

    // Run CPU benchmarks
    console.log("\nRunning CPU benchmarks...");
    iterationResults.tests.cpu = await runCPUBenchmarks(i);

    // Store iteration results
    addIterationResults(benchmarkResults, iterationResults);

    // Write intermediate results to keep data safe
    if (i % 10 === 0 || i === BENCHMARK_CONFIG.iterations - 1) {
      await saveResults(calculateSummaryStatistics(benchmarkResults));
    }

    // Pause between iterations to let system stabilize
    if (i < BENCHMARK_CONFIG.iterations - 1) {
      console.log(`\nCompleted iteration ${i + 1}/${BENCHMARK_CONFIG.iterations}. Pausing before next iteration...`);
      await sleep(1000);
    }
  }

  // Calculate final summary statistics
  const finalResults = calculateSummaryStatistics(benchmarkResults);

  // Save final results
  await saveResults(finalResults);
  console.log(`\nAll benchmarks completed! Results saved to ${BENCHMARK_CONFIG.outputFile}`);

  // Try to combine results if this is the last runtime being tested
  try {
    await combineResults();
  } catch (error) {
    console.error('Error combining results:', error);
  }
};

// Start benchmarking
console.log(`Starting benchmarks for ${runtime}. Will run ${BENCHMARK_CONFIG.iterations}`);
runBenchmarkSuite();