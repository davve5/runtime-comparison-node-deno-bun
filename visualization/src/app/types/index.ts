// Dataset types
export interface DatasetOption {
  id: string;
  label: string;
}

// Raw benchmark data types
export interface MetricStats {
  min: number;
  max: number;
  avg: number;
  median: number;
}

export interface BenchmarkMetric {
  executionTime: MetricStats;
  memoryUsage: MetricStats;
}

export interface MemoryBenchmarks {
  allocationDeallocation: BenchmarkMetric;
  jsonLoad: BenchmarkMetric;
}

export interface DiskIOBenchmarks {
  fileRead: BenchmarkMetric;
}

export interface CPUBenchmarks {
  fibonacci: BenchmarkMetric;
  primeCalculation: BenchmarkMetric;
}

export interface RuntimeSummary {
  memory: MemoryBenchmarks;
  diskIO: DiskIOBenchmarks;
  cpu: CPUBenchmarks;
}

export interface RuntimeConfig {
  iterations: number;
  sampleEvery: number;
  outputFile: string;
  combinedOutputFile: string;
}

export interface RuntimeData {
  name: string;
  summary: RuntimeSummary;
  date: string;
  config: RuntimeConfig;
}

export interface BenchmarkData {
  date: string;
  runtimes: RuntimeData[];
}

// Transformed data types for charts
export interface ChartDataPoint {
  [key: string]: string | number;
  category: string;
}

export interface RelativePerformanceDataPoint {
  [key: string]: string | number;
  test: string;
}

export interface SpeedupDataPoint {
  [key: string]: string | number;
  category: string;
}

export interface RadarDataPoint {
  [key: string]: string | number;
  category: string;
}

export interface OverallComparisonDataPoint {
  [key: string]: string | number;
  metric: string;
}

export interface TransformedBenchmarkData {
  executionTimeData: ChartDataPoint[];
  memoryUsageData: ChartDataPoint[];
  relativePerformanceData: RelativePerformanceDataPoint[];
  speedupData: SpeedupDataPoint[];
  radarData: RadarDataPoint[];
  overallComparison: OverallComparisonDataPoint[];
  runtimes: string[];
}

// Component props
export interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  note?: string;
}

export interface ChartProps {
  data: ChartDataPoint[] | RelativePerformanceDataPoint[] | SpeedupDataPoint[] | RadarDataPoint[];
  runtimes: string[];
}

export interface SummaryComparisonProps {
  data: OverallComparisonDataPoint[];
  runtimes: string[];
}

export interface RuntimeOverviewProps {
  runtimes: string[];
}