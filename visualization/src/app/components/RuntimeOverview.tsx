import { RUNTIME_COLORS } from '../constants/colors';
import type { RuntimeOverviewProps } from '../types';

const RuntimeOverview: React.FC<RuntimeOverviewProps> = ({ runtimes }) => {
  const runtimeInfo: Record<string, string> = {
    "Node.js": "The original JavaScript runtime built on Chrome's V8 engine. Stable and widely adopted but shows its age in performance benchmarks.",
    "Deno": "Created by Node.js creator Ryan Dahl, Deno emphasizes security and modern JavaScript features. Excels in file I/O operations.",
    "Bun": "The newest runtime focusing on speed and developer experience. Shows impressive performance in CPU-intensive tasks and memory handling."
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Runtime Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {runtimes.map(runtime => (
          <div key={runtime} className="p-4 border rounded">
            <h3 className="font-bold text-lg" style={{color: RUNTIME_COLORS[runtime]}}>{runtime}</h3>
            <p className="text-sm text-gray-700">{runtimeInfo[runtime]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuntimeOverview;