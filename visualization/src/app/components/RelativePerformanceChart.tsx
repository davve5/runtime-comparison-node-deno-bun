import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RUNTIME_COLORS } from '../constants/colors';
import type { ChartProps } from '../types';
import ChartContainer from './ChartContainer';


const RelativePerformanceChart: React.FC<ChartProps> = ({ data, runtimes }) => {
  return (
    <ChartContainer 
      title="Relative Performance (higher is better)"
      note="Values are normalized where 1.0 represents the fastest runtime for each test. Higher is better."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 1]} />
          <YAxis dataKey="test" type="category" />
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

export default RelativePerformanceChart;