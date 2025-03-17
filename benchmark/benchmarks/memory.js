import { benchmark } from '../utils/helpers.js';
import { fsPromises, runtime } from '../utils/runtime.js';

const runMemoryAllocationBenchmark = async (iteration) => {
  return await benchmark('Memory Allocation/Deallocation', async () => {
    const iterations = 1000;
    const results = { allocations: 0, deallocations: 0 };

    for (let i = 0; i < iterations; i++) {
      const size = Math.floor(Math.random() * 1000000) + 1000;
      let buffer;

      if (runtime === 'Node.js') {
        buffer = Buffer.alloc(size);
      } else {
        buffer = new Uint8Array(size);
      }

      for (let j = 0; j < size; j += 1000) {
        buffer[j] = Math.floor(Math.random() * 256);
      }

      results.allocations++;

      buffer = null;
      results.deallocations++;

      if (i % 100 === 0) {
        // forceGC();
        // await sleep(10);
      }
    }

    return `Completed ${results.allocations} allocations and ${results.deallocations} deallocations`;
  }, iteration);
};

const runJsonLoadBenchmark = async (iteration) => {
  return await benchmark('Large JSON Memory Load', async () => {
    let jsonData;

    if (runtime === 'Node.js') {
      const data = await fsPromises.readFile('large-data.json', 'utf8');
      jsonData = JSON.parse(data);
    }
    else if (runtime === 'Deno') {
      const data = await Deno.readTextFile('large-data.json');
      jsonData = JSON.parse(data);
    }
    else if (runtime === 'Bun') {
      const file = Bun.file('large-data.json');
      const data = await file.text();
      jsonData = JSON.parse(data);
    }

    return `Loaded JSON with ${jsonData.data.length} entries`;
  }, iteration);
};

export const runMemoryBenchmarks = async (iteration) => {
  const results = {};
  results.allocationDeallocation = await runMemoryAllocationBenchmark(iteration);
  results.jsonLoad = await runJsonLoadBenchmark(iteration);
  return results;
};

