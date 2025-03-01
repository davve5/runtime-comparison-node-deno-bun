import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RUNTIME_COLORS } from '../constants/colors';
import type { ChartProps } from '../types';
import ChartContainer from './ChartContainer';

const ExecutionTimeChart: React.FC<ChartProps> = ({ data, runtimes }) => {
  return (
    <ChartContainer 
      title="Execution Time Comparison (ms, lower is better)"
      note="Lower execution time is better. Bun performs best in CPU and memory tests, while Deno excels at file reading operations."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Legend />
          {runtimes.map(runtime => (
            <Bar key={runtime} dataKey={runtime} fill={RUNTIME_COLORS[runtime]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ExecutionTimeChart;