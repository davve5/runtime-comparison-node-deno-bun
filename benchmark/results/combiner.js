const { readJsonFromFile, saveJsonToFile, fileExists } = require('../utils/filesystem');
const { BENCHMARK_CONFIG } = require('../config');

// Get paths to individual runtime result files
const getResultFilePaths = () => {
  return [
    '../visualization/public/data/benchmark-results-nodejs.json',
    '../visualization/public/data/benchmark-results-deno.json',
    '../visualization/public/data/benchmark-results-bun.json'
  ];
};

// Combine results from all runtimes
const combineResults = async () => {
  console.log('\n----- Combining results from all runtimes -----');

  const filePaths = getResultFilePaths();
  const combinedResults = {
    date: new Date().toISOString(),
    runtimes: []
  };

  // Check for existing files and read them
  for (const filePath of filePaths) {
    if (await fileExists(filePath)) {
      console.log(`Reading results from ${filePath}`);
      const results = await readJsonFromFile(filePath);

      if (results) {
        // Extract just the necessary data (runtime and summary)
        combinedResults.runtimes.push({
          name: results.runtime,
          summary: results.summary,
          date: results.date
        });
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }

  // If we have results from all runtimes, save the combined file
  if (combinedResults.runtimes.length > 0) {
    await saveJsonToFile(BENCHMARK_CONFIG.combinedOutputFile, combinedResults);
    console.log(`Combined results saved to ${BENCHMARK_CONFIG.combinedOutputFile}`);
    return true;
  } else {
    console.log('No results found to combine');
    return false;
  }
};

module.exports = {
  combineResults
};
