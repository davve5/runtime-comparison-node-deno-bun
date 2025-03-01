// src/components/DatasetSelector.tsx
import React, { useEffect, useState } from 'react';
import { listDatasetOptions } from '../lib/datasetUtils';
import type { DatasetOption } from '../types';

interface DatasetSelectorProps {
  selectedDataset: string;
  onSelectDataset: (datasetId: string) => void;
}

const DatasetSelector: React.FC<DatasetSelectorProps> = ({ 
  selectedDataset, 
  onSelectDataset 
}) => {
  const [datasets, setDatasets] = useState<DatasetOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const options = await listDatasetOptions();
        setDatasets(options);
      } catch (error) {
        console.error('Failed to load dataset options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <span>Loading datasets...</span>
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="dataset-selector" className="font-medium text-gray-700">
        Dataset:
      </label>
      <select
        id="dataset-selector"
        value={selectedDataset}
        onChange={(e) => onSelectDataset(e.target.value)}
        className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {datasets.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatasetSelector;