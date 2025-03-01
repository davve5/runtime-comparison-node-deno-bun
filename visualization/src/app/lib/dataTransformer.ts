// src/lib/dataTransformer.ts
import {
  BenchmarkData,
  ChartDataPoint,
  OverallComparisonDataPoint,
  RadarDataPoint,
  RelativePerformanceDataPoint,
  SpeedupDataPoint,
  TransformedBenchmarkData
} from '../types';

export async function fetchBenchmarkData(datasetId: string = '50-1'): Promise<BenchmarkData> {
  try {
    const response = await fetch(`/data/${datasetId}/benchmark-results-combined.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch benchmark data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching benchmark data:', error);
    throw error;
  }
}

export function transformBenchmarkData(data: BenchmarkData): TransformedBenchmarkData {
  const benchmarkCategories = [
    { key: 'allocationDeallocation', label: 'Memory: Allocation/Deallocation' },
    { key: 'jsonLoad', label: 'Memory: JSON Load' },
    { key: 'fileRead', label: 'Disk I/O: File Read' },
    { key: 'fibonacci', label: 'CPU: Fibonacci' },
    { key: 'primeCalculation', label: 'CPU: Prime Calculation' }
  ];

  const runtimes = data.runtimes.map(runtime => runtime.name);

  // Extract execution time data
  const executionTimeData: ChartDataPoint[] = benchmarkCategories.map(category => {
    const result: ChartDataPoint = {
      category: category.label
    };

    data.runtimes.forEach(runtime => {
      let value: number;
      if (category.key === 'allocationDeallocation' || category.key === 'jsonLoad') {
        value = runtime.summary.memory[category.key].executionTime.median;
      } else if (category.key === 'fileRead') {
        value = runtime.summary.diskIO[category.key].executionTime.median;
      } else {
        value = runtime.summary.cpu[category.key].executionTime.median;
      }
      result[runtime.name] = parseFloat(value.toFixed(2));
    });

    return result;
  });

  // Extract memory usage data
  const memoryUsageData: ChartDataPoint[] = benchmarkCategories.map(category => {
    const result: ChartDataPoint = {
      category: category.label
    };

    data.runtimes.forEach(runtime => {
      let value: number;
      if (category.key === 'allocationDeallocation' || category.key === 'jsonLoad') {
        value = runtime.summary.memory[category.key].memoryUsage.median;
      } else if (category.key === 'fileRead') {
        value = runtime.summary.diskIO[category.key].memoryUsage.median;
      } else {
        value = runtime.summary.cpu[category.key].memoryUsage.median;
      }
      result[runtime.name] = parseFloat(value.toFixed(2));
    });

    return result;
  });

  // Create relative performance data (higher is better)
  const relativePerformanceData: RelativePerformanceDataPoint[] = benchmarkCategories.map(category => {
    const categoryData = executionTimeData.find(item => item.category === category.label);
    if (!categoryData) {
      throw new Error(`Category data not found for ${category.label}`);
    }
    
    const runtimeTimes = runtimes.map(runtime => categoryData[runtime] as number);
    const fastestTime = Math.min(...runtimeTimes);

    const result: RelativePerformanceDataPoint = {
      test: category.label
    };

    runtimes.forEach(runtime => {
      result[runtime] = parseFloat((fastestTime / (categoryData[runtime] as number)).toFixed(2));
    });

    return result;
  });

  // Create speedup compared to Node.js
  const speedupData: SpeedupDataPoint[] = benchmarkCategories.map(category => {
    const categoryData = executionTimeData.find(item => item.category === category.label);
    if (!categoryData) {
      throw new Error(`Category data not found for ${category.label}`);
    }
    
    const nodeTime = categoryData['Node.js'] as number;
    const result: SpeedupDataPoint = {
      category: category.label
    };

    runtimes.forEach(runtime => {
      if (runtime !== 'Node.js') {
        result[runtime] = parseFloat((nodeTime / (categoryData[runtime] as number)).toFixed(2));
      }
    });

    return result;
  });

  // Create radar chart data
  const radarData: RadarDataPoint[] = benchmarkCategories.map(category => {
    const relativeData = relativePerformanceData.find(item => item.test === category.label);
    if (!relativeData) {
      throw new Error(`Relative performance data not found for ${category.label}`);
    }
    
    const result: RadarDataPoint = {
      category: category.key === 'allocationDeallocation' ? 'Memory: Alloc/Dealloc' :
                category.key === 'jsonLoad' ? 'Memory: JSON Load' :
                category.key === 'fileRead' ? 'Disk I/O: File Read' :
                category.key === 'fibonacci' ? 'CPU: Fibonacci' :
                'CPU: Prime Calc'
    };

    runtimes.forEach(runtime => {
      result[runtime] = Math.round((relativeData[runtime] as number) * 100);
    });

    return result;
  });

  // Find items in relativePerformanceData by partial test name
  const findTestByPartialName = (partialName: string): RelativePerformanceDataPoint | undefined => {
    return relativePerformanceData.find(item => (item.test as string).includes(partialName));
  };

  // Create summary comparison data
  const overallComparison: OverallComparisonDataPoint[] = [
    {
      metric: "Overall CPU Performance",
      'Node.js': Math.round(((findTestByPartialName('Fibonacci')?.[
        'Node.js'
      ] as number) + (findTestByPartialName('Prime')?.[
        'Node.js'
      ] as number)) * 50),
      'Deno': Math.round(((findTestByPartialName('Fibonacci')?.[
        'Deno'
      ] as number) + (findTestByPartialName('Prime')?.[
        'Deno'
      ] as number)) * 50),
      'Bun': Math.round(((findTestByPartialName('Fibonacci')?.[
        'Bun'
      ] as number) + (findTestByPartialName('Prime')?.[
        'Bun'
      ] as number)) * 50)
    },
    {
      metric: "Overall Memory Efficiency",
      'Node.js': Math.round(((findTestByPartialName('Allocation')?.[
        'Node.js'
      ] as number) + (findTestByPartialName('JSON Load')?.[
        'Node.js'
      ] as number)) * 50),
      'Deno': Math.round(((findTestByPartialName('Allocation')?.[
        'Deno'
      ] as number) + (findTestByPartialName('JSON Load')?.[
        'Deno'
      ] as number)) * 50),
      'Bun': Math.round(((findTestByPartialName('Allocation')?.[
        'Bun'
      ] as number) + (findTestByPartialName('JSON Load')?.[
        'Bun'
      ] as number)) * 50)
    },
    {
      metric: "Overall Disk I/O",
      'Node.js': Math.round((findTestByPartialName('File Read')?.[
        'Node.js'
      ] as number) * 100),
      'Deno': Math.round((findTestByPartialName('File Read')?.[
        'Deno'
      ] as number) * 100),
      'Bun': Math.round((findTestByPartialName('File Read')?.[
        'Bun'
      ] as number) * 100)
    }
  ];

  return {
    executionTimeData,
    memoryUsageData,
    relativePerformanceData,
    speedupData,
    radarData,
    overallComparison,
    runtimes
  };
}