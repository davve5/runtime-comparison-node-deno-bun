import path from 'node:path';
import { fsPromises, runtime } from './runtime.js';

export const ensureDirectoryExists = async (filePath) => {
  const dirPath = path.dirname(filePath);

  try {
    if (runtime === 'Node.js') {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
    else if (runtime === 'Deno') {
      try {
        await Deno.stat(dirPath);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          await Deno.mkdir(dirPath, { recursive: true });
        } else {
          throw error;
        }
      }
    }
    else if (runtime === 'Bun') {
      try {
        const dir = Bun.file(dirPath);
        if (!(await dir.exists())) {
          await Bun.mkdir(dirPath, { recursive: true });
        }
      } catch (error) {
        const fs = await import('fs/promises');
        await fs.mkdir(dirPath, { recursive: true });
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not create directory ${dirPath}: ${error.message}`);
  }
};

export const saveJsonToFile = async (filePath, data) => {
  await ensureDirectoryExists(filePath);
  const jsonStr = JSON.stringify(data, null, 2);

  if (runtime === 'Node.js') {
    await fsPromises.writeFile(filePath, jsonStr);
  }
  else if (runtime === 'Deno') {
    await Deno.writeTextFile(filePath, jsonStr);
  }
  else if (runtime === 'Bun') {
    await Bun.write(filePath, jsonStr);
  }
};

export const readJsonFromFile = async (filePath) => {
  try {
    if (runtime === 'Node.js') {
      const data = await fsPromises.readFile(filePath, 'utf8');
      return JSON.parse(data);
    }
    else if (runtime === 'Deno') {
      const data = await Deno.readTextFile(filePath);
      return JSON.parse(data);
    }
    else if (runtime === 'Bun') {
      const file = Bun.file(filePath);
      const data = await file.text();
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
};

export const fileExists = async (filePath) => {
  try {
    if (runtime === 'Node.js') {
      await fsPromises.access(filePath);
      return true;
    }
    else if (runtime === 'Deno') {
      await Deno.stat(filePath);
      return true;
    }
    else if (runtime === 'Bun') {
      const file = Bun.file(filePath);
      return await file.exists();
    }
  } catch (error) {
    return false;
  }
};