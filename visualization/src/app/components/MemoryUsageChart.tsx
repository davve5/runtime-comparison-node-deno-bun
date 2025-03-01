import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RUNTIME_COLORS } from '../constants/colors';
import type { ChartProps } from '../types';
import ChartContainer from './ChartContainer';

const MemoryUsageChart: React.FC<ChartProps> = ({ data, runtimes }) => {
  return (
    <ChartContainer 
      title="Memory Usage Comparison (MB)"
      note="Negative values represent memory freed. Bun generally shows better memory management in allocation/deallocation tests."
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

export default MemoryUsageChart;

