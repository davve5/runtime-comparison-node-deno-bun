// Chart type options
export type ChartType = 
  | 'execution-time'
  | 'memory-usage'
  | 'performance-ratio'
  | 'iteration-timeline'
  | 'radar-comparison';

// Category filter options
export type CategoryType = 'all' | 'memory' | 'diskIO' | 'cpu';

// Chart data structure
export interface ChartData {
  name: string;
  category: string;
  [key: string]: any; // For dynamic runtime names and metrics
}

// Test metrics
export interface TestMetrics {
  min: number;
  max: number;
  avg: number;
  median: number;
}

// Test results structure
export interface TestResult {
  executionTime: TestMetrics;
  memoryUsage: TestMetrics;
}

// Benchmark runtime configuration
export interface RuntimeConfig {
  iterations: number;
  sampleEvery: number;
  outputFile: string;
  combinedOutputFile: string;
}

// Benchmark memory tests
export interface MemoryTests {
  allocationDeallocation: TestResult;
  jsonLoad: TestResult;
}

// Benchmark disk IO tests
export interface DiskIOTests {
  fileRead: TestResult;
}

// Benchmark CPU tests
export interface CPUTests {
  fibonacci: TestResult;
  primeCalculation: TestResult;
}

// Summary of all benchmark tests
export interface BenchmarkSummary {
  memory: MemoryTests;
  diskIO: DiskIOTests;
  cpu: CPUTests;
}

// Iteration test result detail
export interface IterationTestDetail {
  name: string;
  executionTime: number;
  startMemory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  endMemory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  memoryDifference: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  result: string;
}

// Iteration tests
export interface IterationTests {
  memory: {
    allocationDeallocation: IterationTestDetail;
    jsonLoad: IterationTestDetail;
  };
  diskIO: {
    fileRead: IterationTestDetail;
  };
  cpu: {
    fibonacci: IterationTestDetail;
    primeCalculation: IterationTestDetail;
  };
}

// Benchmark iteration
export interface BenchmarkIteration {
  iteration: number;
  timestamp: string;
  tests: IterationTests;
}

// Runtime data
export interface Runtime {
  name: string;
  summary: BenchmarkSummary;
  date: string;
  config: RuntimeConfig;
  iterations?: BenchmarkIteration[];
}

// Full benchmark data
export interface BenchmarkData {
  date: string;
  runtimes: Runtime[];
}