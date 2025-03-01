import { ChartContainerProps } from '@/types';
import React from 'react';

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, note }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="h-96">
        {children}
      </div>
      {note && (
        <div className="mt-4 text-sm text-gray-600">
          {note}
        </div>
      )}
    </div>
  );
};

export default ChartContainer;
