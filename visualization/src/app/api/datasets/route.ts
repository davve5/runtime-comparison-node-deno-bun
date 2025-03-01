import type { DatasetOption } from '@/app/types';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Path to the data directory
    const dataDir = path.join(process.cwd(), 'public/data');
    
    // Read all directories
    const dirs = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Format as dataset options
    const datasets: DatasetOption[] = dirs.map(dir => {
      const [iterations, sampleEvery] = dir.split('-').map(Number);
      return {
        id: dir,
        label: `${iterations} iterations, sample every ${sampleEvery}`
      };
    });
    
    // Sort by iterations and then by sampleEvery
    datasets.sort((a, b) => {
      const [aIterations, aSampleEvery] = a.id.split('-').map(Number);
      const [bIterations, bSampleEvery] = b.id.split('-').map(Number);
      
      if (aIterations === bIterations) {
        return aSampleEvery - bSampleEvery;
      }
      return aIterations - bIterations;
    });
    
    return NextResponse.json(datasets);
  } catch (error) {
    console.error('Error reading dataset directories:', error);
    return NextResponse.json(
      { error: 'Failed to list datasets' },
      { status: 500 }
    );
  }
}