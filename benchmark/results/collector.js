import { runtime } from '../config.js';
import { saveJsonToFile } from '../utils/filesystem.js';
import { getMedian } from '../utils/helpers.js';

export const initBenchmarkResults = () => {
  return {
    runtime,
    date: new Date().toISOString(),
    config: {},
    summary: {},
    iterations: []
  };
};

export const addIterationResults = (benchmarkResults, iterationResults) => {
  benchmarkResults.iterations.push(iterationResults);
  return benchmarkResults;
};

export const calculateSummaryStatistics = (benchmarkResults) => {
  const aggregatedResults = {};

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

export const saveResults = async (benchmarkResults, outputFile) => {
  await saveJsonToFile(outputFile, benchmarkResults);
  console.log(`Results saved to ${outputFile}`);
};