import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { RUNTIME_COLORS } from '../constants/colors';
import type { ChartProps } from '../types';
import ChartContainer from './ChartContainer';

const RadarChart: React.FC<ChartProps> = ({ data, runtimes }) => {
  return (
    <ChartContainer 
      title="Performance Profile Comparison"
      note="Values are normalized on a scale of 0-100 where higher is better. Bun shows strong performance in CPU and memory tests, while Deno excels at file I/O."
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          {runtimes.map(runtime => (
            <Radar 
              key={runtime}
              name={runtime} 
              dataKey={runtime} 
              stroke={RUNTIME_COLORS[runtime]} 
              fill={RUNTIME_COLORS[runtime]} 
              fillOpacity={0.5} 
            />
          ))}
          <Legend />
          <Tooltip />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RadarChart;