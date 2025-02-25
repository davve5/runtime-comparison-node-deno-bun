import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

/**
 * API route handler for fetching available benchmark folders
 */
export async function GET() {
  try {
    const folders = await getAvailableFolders();
    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get available folders',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * Gets the list of available benchmark folders
 */
async function getAvailableFolders(): Promise<string[]> {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data');
    
    // Check if directory exists
    try {
      await fs.access(dataPath);
    } catch {
      // Directory doesn't exist, return fallback
      return getFallbackFolders();
    }
    
    const folders = await fs.readdir(dataPath);
    
    // Filter to ensure we only get directories
    const folderStats = await Promise.all(
      folders.map(async (folder) => {
        const fullPath = path.join(dataPath, folder);
        try {
          const stat = await fs.stat(fullPath);
          return { name: folder, isDirectory: stat.isDirectory() };
        } catch {
          return { name: folder, isDirectory: false };
        }
      })
    );
    
    const validFolders = folderStats
      .filter(item => item.isDirectory && /^[0-9]+-[0-9]+$/.test(item.name))
      .map(item => item.name);
    
    if (validFolders.length === 0) {
      return getFallbackFolders();
    }
    
    // Sort folders
    return validFolders.sort((a, b) => {
      // Sort by iterations first, then sample rate
      const [aIterations, aSample] = a.split('-').map(Number);
      const [bIterations, bSample] = b.split('-').map(Number);
      
      if (aIterations !== bIterations) {
        return aIterations - bIterations;
      }
      return aSample - bSample;
    });
  } catch (error) {
    console.error('Error getting available folders:', error);
    return getFallbackFolders();
  }
}

/**
 * Gets a fallback list of folders when file system access fails
 */
function getFallbackFolders(): string[] {
  return [
    '10-1', '10-2', '10-5', '10-10',
    '20-1', '20-2', '20-5', '20-10',
    '50-1', '50-2', '50-5'
  ];
}