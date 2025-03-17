import { runCPUBenchmarks } from './benchmarks/cpu.js';
import { runDiskIOBenchmarks } from './benchmarks/disk.js';
import { runMemoryBenchmarks } from './benchmarks/memory.js';
import { createBenchmarkConfig, runtime } from './config.js';
import {
  addIterationResults,
  calculateSummaryStatistics,
  initBenchmarkResults,
  saveResults
} from './results/collector.js';
import { combineResults } from './results/combiner.js';
import { readArgs } from './utils/cli.js';
import { sleep } from './utils/helpers.js';

const runBenchmarkSuite = async () => {
  const args = readArgs();
  console.log('Parsed arguments:', args);

  const iterations = args.iterations || 10;
  const sampleEvery = args.sampleEvery || 2;

  const BENCHMARK_CONFIG = createBenchmarkConfig(iterations, sampleEvery);
  console.log(`Configured benchmarks with ${iterations} iterations, sampling every ${sampleEvery} iterations`);
  console.log(`Results will be saved to: ${BENCHMARK_CONFIG.outputFile}`);

  const benchmarkResults = initBenchmarkResults();
  benchmarkResults.config = BENCHMARK_CONFIG;

  // if (args.generateTestFiles) {
  // await generateTestFiles()
  // }

  console.log(`Starting benchmarks for ${runtime}. Will run ${iterations} iterations`);

  for (let i = 0; i < iterations; i++) {
    console.log(`\n===== STARTING BENCHMARK ITERATION ${i + 1}/${iterations} =====`);

    const iterationResults = {
      iteration: i + 1,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    console.log("\nRunning memory benchmarks...");
    iterationResults.tests.memory = await runMemoryBenchmarks(i);

    console.log("\nRunning disk I/O benchmarks...");
    iterationResults.tests.diskIO = await runDiskIOBenchmarks(i);

    console.log("\nRunning CPU benchmarks...");
    iterationResults.tests.cpu = await runCPUBenchmarks(i);

    addIterationResults(benchmarkResults, iterationResults);

    if (i % 10 === 0 || i === iterations - 1) {
      await saveResults(calculateSummaryStatistics(benchmarkResults), BENCHMARK_CONFIG.outputFile);
    }

    if (i < iterations - 1) {
      console.log(`\nCompleted iteration ${i + 1}/${iterations}. Pausing before next iteration...`);
      await sleep(1000);
    }
  }

  const finalResults = calculateSummaryStatistics(benchmarkResults);
  await saveResults(finalResults, BENCHMARK_CONFIG.outputFile);
  console.log(`\nAll benchmarks completed! Results saved to ${BENCHMARK_CONFIG.outputFile}`);

  try {
    await combineResults(BENCHMARK_CONFIG.combinedOutputFile);
  } catch (error) {
    console.error('Error combining results:', error);
  }
};

runBenchmarkSuite();