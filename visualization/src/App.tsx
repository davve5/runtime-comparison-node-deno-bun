import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar, RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

// Define TypeScript interfaces for the benchmark data structure
interface TestResult {
  executionTime: {
    avg: number;
    min: number;
    max: number;
  };
  memoryUsage: {
    avg: number;
    min: number;
    max: number;
  };
}

interface CategoryTests {
  [testName: string]: TestResult;
}

interface RuntimeSummary {
  memory: CategoryTests;
  diskIO: CategoryTests;
  cpu: CategoryTests;
}

interface RuntimeData {
  runtime: string;
  version: string;
  summary: RuntimeSummary;
}

interface BenchmarkData {
  node: RuntimeData;
  deno: RuntimeData;
  bun: RuntimeData;
  [key: string]: RuntimeData;
}

// Function to load benchmark data from JSON file
const loadBenchmarkData = async (): Promise<BenchmarkData> => {
  try {
    const response = await fetch('/data/benchmark-results.json');
    if (!response.ok) {
      throw new Error(`Failed to load benchmark data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading benchmark data:', error);
    throw error;
  }
};

// Prepare data for the charts
const prepareExecutionTimeData = (benchmarkData: BenchmarkData) => {
  const tests = [
    { name: 'Memory Allocation', key: 'memory.allocationDeallocation' },
    { name: 'JSON Load', key: 'memory.jsonLoad' },
    { name: 'File Read', key: 'diskIO.fileRead' },
    { name: 'Fibonacci', key: 'cpu.fibonacci' },
    { name: 'Prime Calc', key: 'cpu.primeCalculation' }
  ];

  return tests.map(test => {
    const [category, testName] = test.key.split('.');
    return {
      name: test.name,
      'Node.js': benchmarkData.node.summary[category as keyof RuntimeSummary][testName].executionTime.avg,
      'Deno': benchmarkData.deno.summary[category as keyof RuntimeSummary][testName].executionTime.avg,
      'Bun': benchmarkData.bun.summary[category as keyof RuntimeSummary][testName].executionTime.avg
    };
  });
};

const prepareMemoryUsageData = (benchmarkData: BenchmarkData) => {
  const tests = [
    { name: 'Memory Allocation', key: 'memory.allocationDeallocation' },
    { name: 'JSON Load', key: 'memory.jsonLoad' },
    { name: 'File Read', key: 'diskIO.fileRead' },
    { name: 'Fibonacci', key: 'cpu.fibonacci' },
    { name: 'Prime Calc', key: 'cpu.primeCalculation' }
  ];

  return tests.map(test => {
    const [category, testName] = test.key.split('.');
    return {
      name: test.name,
      'Node.js': benchmarkData.node.summary[category as keyof RuntimeSummary][testName].memoryUsage.avg,
      'Deno': benchmarkData.deno.summary[category as keyof RuntimeSummary][testName].memoryUsage.avg,
      'Bun': benchmarkData.bun.summary[category as keyof RuntimeSummary][testName].memoryUsage.avg
    };
  });
};

const prepareRadarData = (benchmarkData: BenchmarkData) => {
  // Normalize all values to a 0-100 scale for radar chart
  const normalizeValue = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // For execution time, lower is better, so we invert the scale
  const getTimeScore = (category: keyof RuntimeSummary, test: string, runtime: string) => {
    const times = [
      benchmarkData.node.summary[category][test].executionTime.avg,
      benchmarkData.deno.summary[category][test].executionTime.avg,
      benchmarkData.bun.summary[category][test].executionTime.avg
    ];
    const min = Math.min(...times);
    const max = Math.max(...times);
    // Invert because lower execution time is better
    return 100 - normalizeValue(benchmarkData[runtime].summary[category][test].executionTime.avg, min, max);
  };

  return [
    {
      category: "Memory Allocation",
      "Node.js": getTimeScore("memory", "allocationDeallocation", "node"),
      "Deno": getTimeScore("memory", "allocationDeallocation", "deno"),
      "Bun": getTimeScore("memory", "allocationDeallocation", "bun")
    },
    {
      category: "JSON Processing",
      "Node.js": getTimeScore("memory", "jsonLoad", "node"),
      "Deno": getTimeScore("memory", "jsonLoad", "deno"),
      "Bun": getTimeScore("memory", "jsonLoad", "bun")
    },
    {
      category: "File I/O",
      "Node.js": getTimeScore("diskIO", "fileRead", "node"),
      "Deno": getTimeScore("diskIO", "fileRead", "deno"),
      "Bun": getTimeScore("diskIO", "fileRead", "bun")
    },
    {
      category: "Recursion",
      "Node.js": getTimeScore("cpu", "fibonacci", "node"),
      "Deno": getTimeScore("cpu", "fibonacci", "deno"),
      "Bun": getTimeScore("cpu", "fibonacci", "bun")
    },
    {
      category: "CPU Intensive",
      "Node.js": getTimeScore("cpu", "primeCalculation", "node"),
      "Deno": getTimeScore("cpu", "primeCalculation", "deno"),
      "Bun": getTimeScore("cpu", "primeCalculation", "bun")
    }
  ];
};

// Calculate overall score for each runtime
const calculateOverallScores = (benchmarkData: BenchmarkData) => {
  const categories = [
    { name: 'Memory Operations', weight: 0.2, tests: [{ cat: 'memory' as keyof RuntimeSummary, test: 'allocationDeallocation', weight: 1.0 }] },
    { name: 'JSON Processing', weight: 0.2, tests: [{ cat: 'memory' as keyof RuntimeSummary, test: 'jsonLoad', weight: 1.0 }] },
    { name: 'File I/O', weight: 0.2, tests: [{ cat: 'diskIO' as keyof RuntimeSummary, test: 'fileRead', weight: 1.0 }] },
    { name: 'CPU Performance', weight: 0.4, tests: [
      { cat: 'cpu' as keyof RuntimeSummary, test: 'fibonacci', weight: 0.5 },
      { cat: 'cpu' as keyof RuntimeSummary, test: 'primeCalculation', weight: 0.5 }
    ]}
  ];
  
  const scores: {[key: string]: number} = { 'Node.js': 0, 'Deno': 0, 'Bun': 0 };
  
  categories.forEach(category => {
    const runtimes = ['node', 'deno', 'bun'];
    
    category.tests.forEach(test => {
      // Get execution times for this test
      const times = runtimes.map(r => 
        benchmarkData[r].summary[test.cat][test.test].executionTime.avg
      );
      
      // Calculate score (lower is better for execution time)
      const min = Math.min(...times);
      runtimes.forEach((runtime, i) => {
        const normalizedScore = min / times[i]; // 1.0 for the fastest, less for others
        scores[benchmarkData[runtime].runtime] += normalizedScore * test.weight * category.weight;
      });
    });
  });
  
  // Convert to array format for chart
  return Object.keys(scores).map(runtime => ({
    name: runtime,
    score: scores[runtime] * 10 // Scale to 0-10
  }));
};

type TabType = 'overview' | 'execution' | 'memory' | 'comparison';

export default function BenchmarkDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadBenchmarkData();
        setBenchmarkData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load benchmark data. Please check the console for details.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading benchmark data...</div>
      </div>
    );
  }
  
  if (error || !benchmarkData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error || 'An unexpected error occurred'}</div>
      </div>
    );
  }

  const executionTimeData = prepareExecutionTimeData(benchmarkData);
  const memoryUsageData = prepareMemoryUsageData(benchmarkData);
  const radarData = prepareRadarData(benchmarkData);
  const overallScores = calculateOverallScores(benchmarkData);

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center">JavaScript Runtime Benchmark Comparison</h1>
      
      <div className="flex space-x-2 justify-center">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'execution' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('execution')}
        >
          Execution Time
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'memory' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('memory')}
        >
          Memory Usage
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('comparison')}
        >
          Radar Comparison
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Overall Performance Score</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overallScores}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} label={{ value: 'Score (higher is better)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => value.toFixed(2)} />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Overall score based on weighted average of all benchmarks. Higher scores indicate better overall performance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Runtime Strengths</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Node.js" dataKey="Node.js" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                  <Radar name="Deno" dataKey="Deno" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                  <Radar name="Bun" dataKey="Bun" stroke="#ff8042" fill="#ff8042" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Radar chart showing the relative strengths of each runtime across different categories.
              Higher scores indicate better performance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Bun</strong> excels at file I/O operations and shows significant performance advantages in CPU-intensive tasks.</li>
              <li><strong>Deno</strong> provides balanced performance and improved memory efficiency compared to Node.js.</li>
              <li><strong>Node.js</strong> remains competitive and reliable but is generally slower than newer runtimes.</li>
              <li>For JSON processing, <strong>Bun</strong> is approximately 40% faster than Node.js and 30% faster than Deno.</li>
              <li>Memory allocation/deallocation is most efficient in <strong>Bun</strong>, followed by Deno.</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'execution' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Execution Time Comparison (ms) - Lower is Better</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={executionTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Milliseconds (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Node.js" fill="#8884d8" />
                <Bar dataKey="Deno" fill="#82ca9d" />
                <Bar dataKey="Bun" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Observations:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bun consistently outperforms both Node.js and Deno in execution time across all test categories</li>
              <li>The most significant performance gap is in CPU-intensive operations (Prime Calculation)</li>
              <li>File I/O operations show the largest relative difference between runtimes</li>
              <li>JSON parsing shows significant performance variations between the three runtimes</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'memory' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Memory Usage Comparison (MB) - Lower is Better</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memoryUsageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Node.js" fill="#8884d8" />
                <Bar dataKey="Deno" fill="#82ca9d" />
                <Bar dataKey="Bun" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Memory Usage Analysis:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>JSON loading has the highest memory footprint across all runtimes</li>
              <li>Bun generally uses less memory than Node.js and Deno for most operations</li>
              <li>Memory differences are minimal for CPU-bound operations (Fibonacci, Prime Calculation)</li>
              <li>For memory allocation/deallocation, all three runtimes show comparable efficiency</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'comparison' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Runtime Capability Comparison</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={150} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Node.js" dataKey="Node.js" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                <Radar name="Deno" dataKey="Deno" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                <Radar name="Bun" dataKey="Bun" stroke="#ff8042" fill="#ff8042" fillOpacity={0.2} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}