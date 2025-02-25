'use client';

import { calculateOverallScore } from '@/lib/metrics';
import { BenchmarkData, RuntimeConfig } from '@/types/benchmark';

interface PerformanceScoreCardsProps {
  benchmarkData: BenchmarkData;
  runtimeConfigs: {
    name: string;
    date: string;
    config: RuntimeConfig;
  }[];
}

export function PerformanceScoreCards({ benchmarkData, runtimeConfigs }: PerformanceScoreCardsProps) {
  const overallScore = calculateOverallScore(benchmarkData);
  
  if (!overallScore) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Overall Performance Ratio</h3>
        <div className="flex items-center">
          <div className={`text-4xl font-bold ${parseFloat(overallScore) > 1 ? 'text-green-600' : 'text-red-600'}`}>
            {overallScore}x
          </div>
          <div className="ml-4 text-sm">
            {parseFloat(overallScore) > 1 
              ? 'Node.js is slower than Bun' 
              : 'Node.js is faster than Bun'}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
        <p className="text-gray-700">
          {new Date(benchmarkData.date).toLocaleString()}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Benchmark Config</h3>
        <div className="text-sm text-gray-700">
          <p>Iterations: {runtimeConfigs[0]?.config.iterations}</p>
          <p>Sample Every: {runtimeConfigs[0]?.config.sampleEvery}</p>
        </div>
      </div>
    </div>
  );
}