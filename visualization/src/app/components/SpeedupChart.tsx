import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RUNTIME_COLORS } from "../constants/colors";
import type { ChartProps } from "../types";
import ChartContainer from "./ChartContainer";

const SpeedupChart: React.FC<ChartProps> = ({ data, runtimes }) => {
  // Filter out Node.js since this is showing speedup compared to Node.js
  const filteredRuntimes = runtimes.filter(runtime => runtime !== 'Node.js');
  
  return (
    <ChartContainer 
      title="Speedup vs Node.js (higher is better)"
      note="Values represent how many times faster Deno and Bun are compared to Node.js. Values above 1.0 indicate better performance than Node.js."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 'dataMax + 0.5']} />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Legend />
          {filteredRuntimes.map(runtime => (
            <Bar key={runtime} dataKey={runtime} fill={RUNTIME_COLORS[runtime]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SpeedupChart;
