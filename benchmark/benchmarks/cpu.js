import { benchmark } from '../utils/helpers.js';

const runFibonacciBenchmark = async (iteration) => {
  return await benchmark('Recursive Fibonacci', async () => {
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }

    const results = [];
    const iterations = 3;
    const N = 40;
    for (let i = 0; i < iterations; i++) {
      const result = fibonacci(N);
      results.push(result);
    }

    return `Calculated Fibonacci(${N}) ${iterations} times, result: ${results[0]}`;
  }, iteration);
};

const runPrimeCalculationBenchmark = async (iteration) => {
  return await benchmark('Prime Number Calculation', async () => {
    function isPrime(num) {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;

      let i = 5;
      while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
      }

      return true;
    }

    function findPrimes(max) {
      const primes = [];
      for (let i = 2; i <= max; i++) {
        if (isPrime(i)) {
          primes.push(i);
        }
      }
      return primes;
    }
    const N = 100_000_000;
    const primes = findPrimes(N);
    return `Found ${primes.length} prime numbers up to ${N}`;
  }, iteration);
};

export const runCPUBenchmarks = async (iteration) => {
  const results = {};
  results.fibonacci = await runFibonacciBenchmark(iteration);
  results.primeCalculation = await runPrimeCalculationBenchmark(iteration);
  return results;
};

