import { BenchmarkData } from '@/types/benchmark';

/**
 * Gets the list of available benchmark folders
 * @returns List of folder names
 */
export async function getAvailableFolders(): Promise<string[]> {
  try {
    // In Next.js client components, we can't use Node.js fs module
    // Instead, we'll make a fetch request to our API
    const response = await fetch('/api/benchmarks/folders');
    
    if (!response.ok) {
      throw new Error('Failed to fetch available folders');
    }
    
    const data = await response.json();
    return data.folders;
  } catch (error) {
    console.error('Error getting available folders:', error);
    // Fallback list if API request fails
    return [
      '10-1', '10-2', '10-5', '10-10',
      '20-1', '20-2', '20-5', '20-10',
      '50-1', '50-2', '50-5'
    ];
  }
}

/**
 * Gets benchmark data for a specific folder
 * @param folder The folder to get data for
 * @returns Benchmark data object
 */
export async function getBenchmarkData(folder: string): Promise<BenchmarkData> {
  try {
    // Make a fetch request to our API
    const response = await fetch(`/api/benchmarks?folder=${encodeURIComponent(folder)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${folder}`);
    }
    
    return await response.json() as BenchmarkData;
  } catch (error) {
    console.error(`Error loading benchmark data for folder ${folder}:`, error);
    throw new Error(`Failed to load benchmark data for ${folder}`);
  }
}