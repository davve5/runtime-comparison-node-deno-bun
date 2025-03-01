import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RUNTIME_COLORS } from '../constants/colors';
import type { SummaryComparisonProps } from '../types';

const SummaryComparison: React.FC<SummaryComparisonProps> = ({ data, runtimes }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Overall Performance Summary</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {runtimes.map(runtime => (
              <Bar key={runtime} dataKey={runtime} fill={RUNTIME_COLORS[runtime]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-lg">Key Findings:</h3>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 space-y-1">
          <li><span className="font-semibold">Bun</span> excels in CPU-intensive tasks, with nearly 2x performance in Fibonacci calculation compared to Node.js and Deno</li>
          <li><span className="font-semibold">Bun</span> shows superior performance in JSON loading (over 2x faster than Node.js)</li>
          <li><span className="font-semibold">Deno</span> is the clear winner for disk I/O operations (2.5x faster than Node.js for file reads)</li>
          <li><span className="font-semibold">Bun</span> shows more efficient memory usage in several tests</li>
          <li><span className="font-semibold">Node.js</span> generally has higher execution times across most benchmarks compared to newer runtimes</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryComparison;
