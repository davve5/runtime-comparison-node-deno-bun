'use client';

import { getAvailableFolders, getBenchmarkData } from '@/lib/benchmark-service';
import { prepareChartData, prepareSummaryData } from '@/lib/data-processing';
import { BenchmarkData, CategoryType, ChartType } from '@/types/benchmark';
import { useEffect, useState } from 'react';
import { BenchmarkChart } from './BenchmarkChart';
import { BenchmarkControls } from './BenchmarkControls';
import { PerformanceScoreCards } from './PerformanceScoreCards';
import { ResultsTable } from './ResultsTable';

export function BenchmarkDashboard() {
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('10-1');
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>('execution-time');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available folders on component mount
  useEffect(() => {
    async function fetchFolders() {
      try {
        const folders = await getAvailableFolders();
        setAvailableFolders(folders);
        
        if (folders.length > 0) {
          setSelectedFolder(folders[0]);
        }
      } catch (err) {
        console.error('Error fetching folders:', err);
        setError('Failed to load benchmark folders');
      }
    }
    
    fetchFolders();
  }, []);

  // Fetch benchmark data when selected folder changes
  useEffect(() => {
    async function fetchData() {
      if (!selectedFolder) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getBenchmarkData(selectedFolder);
        setBenchmarkData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching benchmark data:', err);
        setError(`Failed to load benchmark data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedFolder]);

  // Chart options
  const chartTypes = [
    { id: 'execution-time' as ChartType, label: 'Execution Time (ms)' },
    { id: 'memory-usage' as ChartType, label: 'Memory Usage (MB)' },
    { id: 'performance-ratio' as ChartType, label: 'Performance Ratio' },
    { id: 'iteration-timeline' as ChartType, label: 'Iteration Timeline' },
    { id: 'radar-comparison' as ChartType, label: 'Radar Comparison' }
  ];

  const categories = [
    { id: 'all' as CategoryType, label: 'All Categories' },
    { id: 'memory' as CategoryType, label: 'Memory Tests' },
    { id: 'diskIO' as CategoryType, label: 'Disk I/O Tests' },
    { id: 'cpu' as CategoryType, label: 'CPU Tests' }
  ];

  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
  };

  // Prepare chart data based on selected options
  const chartData = benchmarkData ? prepareChartData(
    benchmarkData, 
    selectedChart, 
    selectedCategory
  ) : [];

  // Get runtime configurations
  const getRuntimeConfigs = () => {
    if (!benchmarkData || !benchmarkData.runtimes) {
      return [];
    }

    return benchmarkData.runtimes.map(runtime => ({
      name: runtime.name,
      date: runtime.date,
      config: runtime.config
    }));
  };

  const runtimeConfigs = getRuntimeConfigs();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Runtime Benchmark Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Compare performance metrics between Node.js and Bun runtimes
      </p>
      
      {/* Control Panel */}
      <BenchmarkControls 
        selectedFolder={selectedFolder}
        selectedChart={selectedChart}
        selectedCategory={selectedCategory}
        availableFolders={availableFolders}
        chartTypes={chartTypes}
        categories={categories}
        onFolderChange={handleFolderChange}
        onChartChange={setSelectedChart}
        onCategoryChange={setSelectedCategory}
      />
      
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading benchmark data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {!loading && !error && benchmarkData && (
        <>
          {/* Performance Score Cards */}
          <PerformanceScoreCards 
            benchmarkData={benchmarkData} 
            runtimeConfigs={runtimeConfigs} 
          />
          
          {/* Main Chart */}
          <BenchmarkChart 
            chartData={chartData}
            selectedChart={selectedChart}
          />
          
          {/* Performance Stats Table */}
          <ResultsTable 
            benchmarkData={benchmarkData}
            summaryData={prepareSummaryData(benchmarkData, 'execution-time', selectedCategory)}
          />
        </>
      )}
    </div>
  );
}