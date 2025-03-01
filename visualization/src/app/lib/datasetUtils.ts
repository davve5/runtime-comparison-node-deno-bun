import type { DatasetOption } from "../types";

/**
 * Lists available dataset options
 * Format of directory names is {iterations}-{sampleEvery}
 */
export async function listDatasetOptions(): Promise<DatasetOption[]> {
  try {
    const response = await fetch('/api/datasets');
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset options: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dataset options:', error);
    // Return default datasets in case of error
    return [
      { id: '10-1', label: '10 iterations, sample every 1' },
      { id: '10-5', label: '10 iterations, sample every 5' },
      { id: '10-10', label: '10 iterations, sample every 10' },
      { id: '20-1', label: '20 iterations, sample every 1' },
      { id: '20-5', label: '20 iterations, sample every 5' },
      { id: '20-10', label: '20 iterations, sample every 10' },
      { id: '50-1', label: '50 iterations, sample every 1' },
      { id: '50-5', label: '50 iterations, sample every 5' },
      { id: '50-10', label: '50 iterations, sample every 10' },
    ];
  }
}

/**
 * Parse dataset ID to get human-readable information
 */
export function parseDatasetId(datasetId: string): { iterations: number; sampleEvery: number } {
  const [iterations, sampleEvery] = datasetId.split('-').map(Number);
  return { iterations, sampleEvery };
}

/**
 * Format dataset for display
 */
export function formatDatasetLabel(datasetId: string): string {
  const { iterations, sampleEvery } = parseDatasetId(datasetId);
  return `${iterations} iterations, sample every ${sampleEvery}`;
}