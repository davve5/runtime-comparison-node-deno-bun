import {
	BenchmarkData,
	CategoryType,
	ChartData,
	ChartType
} from '@/types/benchmark';

/**
 * Prepares data for charts based on selected options
 */
export function prepareChartData(
  benchmarkData: BenchmarkData, 
  selectedChart: ChartType, 
  selectedCategory: CategoryType
): ChartData[] {
  if (selectedChart === 'iteration-timeline') {
    return prepareTimelineData(benchmarkData, selectedCategory);
  } else if (selectedChart === 'radar-comparison') {
    return prepareRadarData(benchmarkData);
  } else {
    return prepareSummaryData(benchmarkData, selectedChart, selectedCategory);
  }
}

/**
 * Prepares data for summary charts (bar/ratio charts)
 */
export function prepareSummaryData(
  benchmarkData: BenchmarkData, 
  selectedChart: ChartType, 
  selectedCategory: CategoryType
): ChartData[] {
  if (!benchmarkData || !benchmarkData.runtimes || benchmarkData.runtimes.length === 0) {
    return [];
  }

  const result: ChartData[] = [];

  // Memory: Allocation/Deallocation
  if (selectedCategory === 'all' || selectedCategory === 'memory') {
    const metricData: ChartData = {
      name: 'Memory: Allocation',
      category: 'memory'
    };

    benchmarkData.runtimes.forEach(runtime => {
      const testData = runtime.summary.memory.allocationDeallocation;
      if (selectedChart === 'execution-time') {
        metricData[runtime.name] = testData.executionTime.avg;
      } else if (selectedChart === 'memory-usage') {
        metricData[runtime.name] = testData.memoryUsage.avg;
      }
    });

    // Calculate performance ratio if needed
    if (selectedChart === 'performance-ratio') {
      const nodeValue = benchmarkData.runtimes.find(r => r.name === 'Node.js')
        ?.summary.memory.allocationDeallocation.executionTime.avg;
      const bunValue = benchmarkData.runtimes.find(r => r.name === 'Bun')
        ?.summary.memory.allocationDeallocation.executionTime.avg;
      
      if (nodeValue !== undefined && bunValue !== undefined) {
        metricData['Node.js'] = (nodeValue / bunValue).toFixed(2);
        metricData['Bun'] = 1;
        metricData['baseline'] = 1;
      }
    }

    result.push(metricData);
  }

  // Memory: JSON Load
  if (selectedCategory === 'all' || selectedCategory === 'memory') {
    const metricData: ChartData = {
      name: 'Memory: JSON Load',
      category: 'memory'
    };

    benchmarkData.runtimes.forEach(runtime => {
      const testData = runtime.summary.memory.jsonLoad;
      if (selectedChart === 'execution-time') {
        metricData[runtime.name] = testData.executionTime.avg;
      } else if (selectedChart === 'memory-usage') {
        metricData[runtime.name] = testData.memoryUsage.avg;
      }
    });

    // Calculate performance ratio if needed
    if (selectedChart === 'performance-ratio') {
      const nodeValue = benchmarkData.runtimes.find(r => r.name === 'Node.js')
        ?.summary.memory.jsonLoad.executionTime.avg;
      const bunValue = benchmarkData.runtimes.find(r => r.name === 'Bun')
        ?.summary.memory.jsonLoad.executionTime.avg;
      
      if (nodeValue !== undefined && bunValue !== undefined) {
        metricData['Node.js'] = (nodeValue / bunValue).toFixed(2);
        metricData['Bun'] = 1;
        metricData['baseline'] = 1;
      }
    }

    result.push(metricData);
  }

  // Disk IO: File Read
  if (selectedCategory === 'all' || selectedCategory === 'diskIO') {
    const metricData: ChartData = {
      name: 'Disk IO: File Read',
      category: 'diskIO'
    };

    benchmarkData.runtimes.forEach(runtime => {
      const testData = runtime.summary.diskIO.fileRead;
      if (selectedChart === 'execution-time') {
        metricData[runtime.name] = testData.executionTime.avg;
      } else if (selectedChart === 'memory-usage') {
        metricData[runtime.name] = testData.memoryUsage.avg;
      }
    });

    // Calculate performance ratio if needed
    if (selectedChart === 'performance-ratio') {
      const nodeValue = benchmarkData.runtimes.find(r => r.name === 'Node.js')
        ?.summary.diskIO.fileRead.executionTime.avg;
      const bunValue = benchmarkData.runtimes.find(r => r.name === 'Bun')
        ?.summary.diskIO.fileRead.executionTime.avg;
      
      if (nodeValue !== undefined && bunValue !== undefined) {
        metricData['Node.js'] = (nodeValue / bunValue).toFixed(2);
        metricData['Bun'] = 1;
        metricData['baseline'] = 1;
      }
    }

    result.push(metricData);
  }

  // CPU: Fibonacci
  if (selectedCategory === 'all' || selectedCategory === 'cpu') {
    const metricData: ChartData = {
      name: 'CPU: Fibonacci',
      category: 'cpu'
    };

    benchmarkData.runtimes.forEach(runtime => {
      const testData = runtime.summary.cpu.fibonacci;
      if (selectedChart === 'execution-time') {
        metricData[runtime.name] = testData.executionTime.avg;
      } else if (selectedChart === 'memory-usage') {
        metricData[runtime.name] = testData.memoryUsage.avg;
      }
    });

    // Calculate performance ratio if needed
    if (selectedChart === 'performance-ratio') {
      const nodeValue = benchmarkData.runtimes.find(r => r.name === 'Node.js')
        ?.summary.cpu.fibonacci.executionTime.avg;
      const bunValue = benchmarkData.runtimes.find(r => r.name === 'Bun')
        ?.summary.cpu.fibonacci.executionTime.avg;
      
      if (nodeValue !== undefined && bunValue !== undefined) {
        metricData['Node.js'] = (nodeValue / bunValue).toFixed(2);
        metricData['Bun'] = 1;
        metricData['baseline'] = 1;
      }
    }

    result.push(metricData);
  }

  // CPU: Prime Calculation
  if (selectedCategory === 'all' || selectedCategory === 'cpu') {
    const metricData: ChartData = {
      name: 'CPU: Prime Calculation',
      category: 'cpu'
    };

    benchmarkData.runtimes.forEach(runtime => {
      const testData = runtime.summary.cpu.primeCalculation;
      if (selectedChart === 'execution-time') {
        metricData[runtime.name] = testData.executionTime.avg;
      } else if (selectedChart === 'memory-usage') {
        metricData[runtime.name] = testData.memoryUsage.avg;
      }
    });

    // Calculate performance ratio if needed
    if (selectedChart === 'performance-ratio') {
      const nodeValue = benchmarkData.runtimes.find(r => r.name === 'Node.js')
        ?.summary.cpu.primeCalculation.executionTime.avg;
      const bunValue = benchmarkData.runtimes.find(r => r.name === 'Bun')
        ?.summary.cpu.primeCalculation.executionTime.avg;
      
      if (nodeValue !== undefined && bunValue !== undefined) {
        metricData['Node.js'] = (nodeValue / bunValue).toFixed(2);
        metricData['Bun'] = 1;
        metricData['baseline'] = 1;
      }
    }

    result.push(metricData);
  }

  return result;
}

/**
 * Prepares data for timeline charts
 */
export function prepareTimelineData(
  benchmarkData: BenchmarkData, 
  selectedCategory: CategoryType
): ChartData[] {
  if (!benchmarkData || !benchmarkData.runtimes || benchmarkData.runtimes.length === 0) {
    return [];
  }

  const result: ChartData[] = [];
  const nodejsRuntime = benchmarkData.runtimes.find(r => r.name === 'Node.js');
  const bunRuntime = benchmarkData.runtimes.find(r => r.name === 'Bun');
  
  if (!nodejsRuntime?.iterations || !bunRuntime?.iterations) {
    return [];
  }

  // Get test path based on selected category
  let testPath: string;
  if (selectedCategory === 'memory') {
    testPath = 'memory.allocationDeallocation';
  } else if (selectedCategory === 'diskIO') {
    testPath = 'diskIO.fileRead';
  } else if (selectedCategory === 'cpu') {
    testPath = 'cpu.fibonacci';
  } else {
    // Default to fibonacci if 'all' is selected
    testPath = 'cpu.fibonacci';
  }

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
  };

  // Create timeline data
  nodejsRuntime.iterations.forEach((iteration) => {
    const timelinePoint: ChartData = {
      name: `Iteration ${iteration.iteration}`,
      category: selectedCategory,
      iteration: iteration.iteration
    };

    // Get execution time for Node.js
    const nodejsTest = getNestedValue(iteration.tests, testPath);
    if (nodejsTest) {
      timelinePoint['Node.js'] = nodejsTest.executionTime;
    }

    // Get execution time for Bun (matching iteration)
    const bunIteration = bunRuntime.iterations.find(i => i.iteration === iteration.iteration);
    if (bunIteration) {
      const bunTest = getNestedValue(bunIteration.tests, testPath);
      if (bunTest) {
        timelinePoint['Bun'] = bunTest.executionTime;
      }
    }

    result.push(timelinePoint);
  });

  return result;
}

/**
 * Prepares data for radar charts
 */
export function prepareRadarData(benchmarkData: BenchmarkData): ChartData[] {
  if (!benchmarkData || !benchmarkData.runtimes || benchmarkData.runtimes.length === 0) {
    return [];
  }

  const result: ChartData[] = [];
  
  // Create normalized data for radar chart
  const metrics = [
    { key: 'memory.allocationDeallocation', name: 'Memory Allocation' },
    { key: 'memory.jsonLoad', name: 'JSON Load' },
    { key: 'diskIO.fileRead', name: 'File Read' },
    { key: 'cpu.fibonacci', name: 'Fibonacci' },
    { key: 'cpu.primeCalculation', name: 'Prime Calculation' }
  ];
  
  // Find the max values for normalization
  const maxValues: Record<string, number> = {};
  metrics.forEach(metric => {
    const values = benchmarkData.runtimes.map(runtime => {
      const [category, test] = metric.key.split('.');
      return runtime.summary[category as keyof typeof runtime.summary][test as any].executionTime.avg;
    });
    maxValues[metric.key] = Math.max(...values);
  });
  
  // Normalize all values to 0-100 range (inverted so lower is better)
  metrics.forEach(metric => {
    const radarPoint: ChartData = {
      metric: metric.name,
      category: metric.key.split('.')[0]
    };
    
    benchmarkData.runtimes.forEach(runtime => {
      const [category, test] = metric.key.split('.');
      const value = runtime.summary[category as keyof typeof runtime.summary][test as any].executionTime.avg;
      // Invert the scale so lower execution time = higher score
      radarPoint[runtime.name] = 100 - ((value / maxValues[metric.key]) * 100);
    });
    
    result.push(radarPoint);
  });
  
  return result;
}