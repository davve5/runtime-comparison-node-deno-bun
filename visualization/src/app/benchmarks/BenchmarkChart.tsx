'use client';

import { ChartData, ChartType } from '@/types/benchmark';
import {
	Area,
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	LineChart,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis, Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis, YAxis
} from 'recharts';

interface BenchmarkChartProps {
  chartData: ChartData[];
  selectedChart: ChartType;
}

export function BenchmarkChart({ chartData, selectedChart }: BenchmarkChartProps) {
  // Get chart title based on selected chart type
  const getChartTitle = (): string => {
    switch (selectedChart) {
      case 'execution-time':
        return 'Execution Time Comparison (ms)';
      case 'memory-usage':
        return 'Memory Usage Comparison (MB)';
      case 'performance-ratio':
        return 'Performance Ratio (Node.js vs Bun)';
      case 'iteration-timeline':
        return 'Iteration Timeline';
      case 'radar-comparison':
        return 'Radar Performance Comparison';
      default:
        return 'Benchmark Comparison';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">{getChartTitle()}</h2>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {selectedChart === 'radar-comparison' ? (
            <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Node.js" dataKey="Node.js" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
              <Radar name="Bun" dataKey="Bun" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          ) : selectedChart === 'iteration-timeline' ? (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Node.js" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Bun" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          ) : selectedChart === 'performance-ratio' ? (
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis label={{ value: 'Ratio (Node.js / Bun)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => [
                  `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}${name === 'baseline' ? '' : 'x'}`
                ]} 
              />
              <Legend />
              <Bar dataKey="Node.js" fill="#8884d8" />
              <Area dataKey="baseline" fill="#82ca9d" stroke="#82ca9d" />
            </ComposedChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis 
                label={{ 
                  value: selectedChart === 'execution-time' 
                    ? 'Execution Time (ms)' 
                    : 'Memory Usage (MB)',
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip formatter={(value) => [
                `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              ]} />
              <Legend />
              <Bar dataKey="Node.js" fill="#8884d8" />
              <Bar dataKey="Bun" fill="#82ca9d" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}