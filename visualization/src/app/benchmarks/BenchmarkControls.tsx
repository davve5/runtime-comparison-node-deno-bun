'use client';

import { CategoryType, ChartType } from '@/types/benchmark';

interface ChartTypeOption {
  id: ChartType;
  label: string;
}

interface CategoryOption {
  id: CategoryType;
  label: string;
}

interface BenchmarkControlsProps {
  selectedFolder: string;
  selectedChart: ChartType;
  selectedCategory: CategoryType;
  availableFolders: string[];
  chartTypes: ChartTypeOption[];
  categories: CategoryOption[];
  onFolderChange: (folder: string) => void;
  onChartChange: (chart: ChartType) => void;
  onCategoryChange: (category: CategoryType) => void;
}

export function BenchmarkControls({
  selectedFolder,
  selectedChart,
  selectedCategory,
  availableFolders,
  chartTypes,
  categories,
  onFolderChange,
  onChartChange,
  onCategoryChange
}: BenchmarkControlsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="folder-select">
            Benchmark Folder:
          </label>
          <select 
            id="folder-select"
            className="w-full p-2 border rounded"
            value={selectedFolder}
            onChange={(e) => onFolderChange(e.target.value)}
          >
            {availableFolders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Format: [iterations]-[sample every]
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="chart-select">
            Chart Type:
          </label>
          <select 
            id="chart-select"
            className="w-full p-2 border rounded"
            value={selectedChart}
            onChange={(e) => onChartChange(e.target.value as ChartType)}
          >
            {chartTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="category-select">
            Category:
          </label>
          <select 
            id="category-select"
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}