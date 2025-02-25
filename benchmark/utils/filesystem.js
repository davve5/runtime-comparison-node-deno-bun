const { runtime, fs, fsPromises, path } = require('./runtime');

// Save results to JSON file
const saveJsonToFile = async (filePath, data) => {
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

// Read JSON file
const readJsonFromFile = async (filePath) => {
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

// Check if file exists
const fileExists = async (filePath) => {
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
      return file.size > 0;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  saveJsonToFile,
  readJsonFromFile,
  fileExists
};
