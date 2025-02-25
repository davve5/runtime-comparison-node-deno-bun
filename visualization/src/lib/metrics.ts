import { BenchmarkData } from '@/types/benchmark';

/**
 * Calculates overall performance score (geometric mean of execution time ratios)
 * @param benchmarkData The benchmark data to analyze
 * @returns Formatted performance ratio as string
 */
export function calculateOverallScore(benchmarkData: BenchmarkData): string | null {
  if (!benchmarkData || !benchmarkData.runtimes || benchmarkData.runtimes.length !== 2) {
    return null;
  }

  const nodejsRuntime = benchmarkData.runtimes.find(r => r.name === 'Node.js');
  const bunRuntime = benchmarkData.runtimes.find(r => r.name === 'Bun');
  
  if (!nodejsRuntime || !bunRuntime) {
    return null;
  }

  try {
    // Calculate the geometric mean of the ratios
    const ratios = [
      nodejsRuntime.summary.memory.allocationDeallocation.executionTime.avg / 
      bunRuntime.summary.memory.allocationDeallocation.executionTime.avg,
      
      nodejsRuntime.summary.memory.jsonLoad.executionTime.avg / 
      bunRuntime.summary.memory.jsonLoad.executionTime.avg,
      
      nodejsRuntime.summary.diskIO.fileRead.executionTime.avg / 
      bunRuntime.summary.diskIO.fileRead.executionTime.avg,
      
      nodejsRuntime.summary.cpu.fibonacci.executionTime.avg / 
      bunRuntime.summary.cpu.fibonacci.executionTime.avg,
      
      nodejsRuntime.summary.cpu.primeCalculation.executionTime.avg / 
      bunRuntime.summary.cpu.primeCalculation.executionTime.avg
    ];
    
    // Calculate geometric mean
    const product = ratios.reduce((acc, ratio) => acc * ratio, 1);
    return Math.pow(product, 1/ratios.length).toFixed(2);
  } catch (err) {
    console.error('Error calculating performance score:', err);
    return null;
  }
}

/**
 * Calculates performance ratio between two runtimes for a specific test
 * @param nodejsValue Execution time for Node.js
 * @param bunValue Execution time for Bun
 * @returns Object containing faster runtime and factor
 */
export function calculatePerformanceRatio(nodejsValue: number, bunValue: number): { 
  faster: 'Node.js' | 'Bun'; 
  factor: string;
} {
  const ratio = nodejsValue / bunValue;
  const faster: 'Node.js' | 'Bun' = ratio > 1 ? 'Bun' : 'Node.js';
  const factor = Math.max(ratio, 1/ratio).toFixed(2);
  
  return { faster, factor };
}