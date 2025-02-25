const getRuntimeName = () => {
	if (typeof Bun !== 'undefined') return 'Bun';
	if (typeof Deno !== 'undefined') return 'Deno';
	if (typeof process !== 'undefined') return 'Node.js';
	throw new Error('Unknown JavaScript runtime');
};

const runtime = getRuntimeName();

const BENCHMARK_CONFIG = {
	iterations: 10, // Number of times to run each benchmark suite
	sampleEvery: 5, // Only collect full memory data every N iterations to reduce overhead
	outputFile: `../visualization/public/data/benchmark-results-${runtime.toLowerCase().replace('.', '')}.json`,
	combinedOutputFile: '../visualization/public/data/benchmark-results-combined.json'
};

module.exports = {
	runtime,
	BENCHMARK_CONFIG
};