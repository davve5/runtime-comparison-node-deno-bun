'use client';

import { BenchmarkData, ChartData } from '@/types/benchmark';

interface ResultsTableProps {
  benchmarkData: BenchmarkData;
  summaryData: ChartData[];
}

export function ResultsTable({ benchmarkData, summaryData }: ResultsTableProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Detailed Benchmark Results</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benchmark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Node.js
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bun
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryData.map((item, index) => {
              // Extract the test name and category from the item name
              const testPathParts = item.name.split(': ');
              const testCategory = item.category.toLowerCase();
              const testName = testPathParts.length > 1 
                ? testPathParts[1].toLowerCase() 
                : testPathParts[0].toLowerCase();
              
              // Get values from the benchmark data
              const nodejsData = benchmarkData.runtimes.find(r => r.name === 'Node.js');
              const bunData = benchmarkData.runtimes.find(r => r.name === 'Bun');
              
              if (!nodejsData || !bunData) return null;
              
              // Get execution time for these tests
              let nodejsValue: number = 0;
              let bunValue: number = 0;
              
              try {
                // Try to access nested properties safely
                if (testCategory === 'memory') {
                  if (testName === 'allocation') {
                    nodejsValue = nodejsData.summary.memory.allocationDeallocation.executionTime.avg;
                    bunValue = bunData.summary.memory.allocationDeallocation.executionTime.avg;
                  } else if (testName === 'json load') {
                    nodejsValue = nodejsData.summary.memory.jsonLoad.executionTime.avg;
                    bunValue = bunData.summary.memory.jsonLoad.executionTime.avg;
                  }
                } else if (testCategory === 'diskio') {
                  nodejsValue = nodejsData.summary.diskIO.fileRead.executionTime.avg;
                  bunValue = bunData.summary.diskIO.fileRead.executionTime.avg;
                } else if (testCategory === 'cpu') {
                  if (testName === 'fibonacci') {
                    nodejsValue = nodejsData.summary.cpu.fibonacci.executionTime.avg;
                    bunValue = bunData.summary.cpu.fibonacci.executionTime.avg;
                  } else if (testName === 'prime calculation') {
                    nodejsValue = nodejsData.summary.cpu.primeCalculation.executionTime.avg;
                    bunValue = bunData.summary.cpu.primeCalculation.executionTime.avg;
                  }
                }
              } catch (err) {
                console.error(`Error accessing test data for ${testCategory}.${testName}:`, err);
                return null;
              }
              
              // Calculate ratio
              const ratio = nodejsValue / bunValue;
              const faster = ratio > 1 ? 'Bun' : 'Node.js';
              const factor = Math.max(ratio, 1/ratio).toFixed(2);
              
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {nodejsValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bunValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={faster === 'Bun' ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                      {faster} is {factor}x faster
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}