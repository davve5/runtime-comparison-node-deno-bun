const { saveJsonToFile } = require('../utils/filesystem');
const { getMedian } = require('../utils/helpers');
const { BENCHMARK_CONFIG, runtime } = require('../config');

// Initialize benchmark results structure
const initBenchmarkResults = () => {
  return {
    runtime,
    date: new Date().toISOString(),
    config: BENCHMARK_CONFIG,
    summary: {},
    iterations: []
  };
};

// Add iteration results to the benchmark results
const addIterationResults = (benchmarkResults, iterationResults) => {
  benchmarkResults.iterations.push(iterationResults);
  return benchmarkResults;
};

// Calculate summary statistics from all iterations
const calculateSummaryStatistics = (benchmarkResults) => {
  const aggregatedResults = {};

  // Extract data from all iterations
  benchmarkResults.iterations.forEach(iteration => {
    Object.keys(iteration.tests).forEach(category => {
      if (!aggregatedResults[category]) {
        aggregatedResults[category] = {};
      }

      Object.keys(iteration.tests[category]).forEach(testName => {
        const test = iteration.tests[category][testName];

        if (!aggregatedResults[category][testName]) {
          aggregatedResults[category][testName] = {
            executionTimes: [],
            memoryUsage: []
          };
        }

        aggregatedResults[category][testName].executionTimes.push(test.executionTime);
        aggregatedResults[category][testName].memoryUsage.push(test.memoryDifference.heapUsed);
      });
    });
  });

  // Calculate statistics for each test
  Object.keys(aggregatedResults).forEach(category => {
    benchmarkResults.summary[category] = {};

    Object.keys(aggregatedResults[category]).forEach(testName => {
      const times = aggregatedResults[category][testName].executionTimes;
      const memUsage = aggregatedResults[category][testName].memoryUsage;

      benchmarkResults.summary[category][testName] = {
        executionTime: {
          min: Math.min(...times),
          max: Math.max(...times),
          avg: times.reduce((a, b) => a + b, 0) / times.length,
          median: getMedian(times)
        },
        memoryUsage: {
          min: Math.min(...memUsage),
          max: Math.max(...memUsage),
          avg: memUsage.reduce((a, b) => a + b, 0) / memUsage.length,
          median: getMedian(memUsage)
        }
      };
    });
  });

  return benchmarkResults;
};

// Save benchmark results to a file
const saveResults = async (benchmarkResults) => {
  await saveJsonToFile(BENCHMARK_CONFIG.outputFile, benchmarkResults);
  console.log(`Results saved to ${BENCHMARK_CONFIG.outputFile}`);
};

module.exports = {
  initBenchmarkResults,
  addIterationResults,
  calculateSummaryStatistics,
  saveResults
};
