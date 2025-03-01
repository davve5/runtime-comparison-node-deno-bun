// src/components/Dashboard.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { parseDatasetId } from '../lib/datasetUtils';
import { fetchBenchmarkData, transformBenchmarkData } from '../lib/dataTransformer';
import type { TransformedBenchmarkData } from '../types';
import DatasetSelector from './DatasetSelector';
import ExecutionTimeChart from './ExecutionTimeChart';
import MemoryUsageChart from './MemoryUsageChart';
import RadarChart from './RadarChart';
import RelativePerformanceChart from './RelativePerformanceChart';
import RuntimeOverview from './RuntimeOverview';
import SpeedupChart from './SpeedupChart';
import SummaryComparison from './SummaryComparison';

type TabType = 'executionTime' | 'relativePerformance' | 'memoryUsage' | 'speedup' | 'radar';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('executionTime');
  const [selectedDataset, setSelectedDataset] = useState<string>('50-1'); // Default dataset
  const [chartData, setChartData] = useState<TransformedBenchmarkData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to load data when the selected dataset changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchBenchmarkData(selectedDataset);
        const transformedData = transformBenchmarkData(data);
        setChartData(transformedData);
      } catch (err) {
        console.error(`Failed to load benchmark data for dataset ${selectedDataset}:`, err);
        setError(`Failed to load benchmark data for dataset ${selectedDataset}. Please check that the dataset exists and try again.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDataset]);

  // Handle dataset selection
  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId);
  };

  // Format dataset info
  const datasetInfo = selectedDataset ? parseDatasetId(selectedDataset) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading benchmark data...</p>
          {selectedDataset && (
            <p className="text-sm text-gray-500 mt-2">
              Dataset: {datasetInfo?.iterations} iterations, sample every {datasetInfo?.sampleEvery}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const { 
    executionTimeData, 
    memoryUsageData, 
    relativePerformanceData, 
    speedupData, 
    radarData, 
    overallComparison,
    runtimes
  } = chartData;

  return (
    <div className="bg-gray-100 p-4 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">JavaScript Runtime Performance Comparison</h1>
        <p className="text-gray-600">Benchmark results for Node.js, Deno, and Bun across various performance metrics</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Dataset selector */}
        <DatasetSelector selectedDataset={selectedDataset} onSelectDataset={handleDatasetChange} />

        {/* Dataset info display */}
        <div className="bg-white px-4 py-2 rounded-md shadow-sm text-sm text-gray-600">
          <span className="font-medium">Current Dataset:</span> {datasetInfo?.iterations} iterations, 
          sample every {datasetInfo?.sampleEvery}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'executionTime' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('executionTime')}
        >
          Execution Time
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'relativePerformance' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('relativePerformance')}
        >
          Relative Performance
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'memoryUsage' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('memoryUsage')}
        >
          Memory Usage
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'speedup' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('speedup')}
        >
          Speedup vs Node.js
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'radar' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('radar')}
        >
          Performance Profile
        </button>
      </div>

      {activeTab === 'executionTime' && (
        <ExecutionTimeChart data={executionTimeData} runtimes={runtimes} />
      )}
      {activeTab === 'relativePerformance' && (
        <RelativePerformanceChart data={relativePerformanceData} runtimes={runtimes} />
      )}
      {activeTab === 'memoryUsage' && (
        <MemoryUsageChart data={memoryUsageData} runtimes={runtimes} />
      )}
      {activeTab === 'speedup' && (
        <SpeedupChart data={speedupData} runtimes={runtimes} />
      )}
      {activeTab === 'radar' && (
        <RadarChart data={radarData} runtimes={runtimes} />
      )}

      <SummaryComparison data={overallComparison} runtimes={runtimes} />
      <RuntimeOverview runtimes={runtimes} />
    </div>
  );
};

export default Dashboard;