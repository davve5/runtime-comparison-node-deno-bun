import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

/**
 * API route handler for fetching benchmark data
 */
export async function GET(request: NextRequest) {
  try {
    // Get folder parameter from query
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder');
    
    // If no folder specified, return error
    if (!folder) {
      return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
    }
    
    // Validate folder name to prevent path traversal attacks
    if (!/^[0-9]+-[0-9]+$/.test(folder)) {
      return NextResponse.json({ error: 'Invalid folder format' }, { status: 400 });
    }
    
    // Get benchmark data
    const data = await getBenchmarkData(folder);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load benchmark data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * Gets benchmark data for a specific folder
 */
async function getBenchmarkData(folder: string) {
  try {
    const filePath = path.join(
      process.cwd(), 
      'public', 
      'data', 
      folder, 
      'benchmark-results-combined.json'
    );
    
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error loading benchmark data for folder ${folder}:`, error);
    throw new Error(`Failed to load benchmark data for ${folder}`);
  }
}