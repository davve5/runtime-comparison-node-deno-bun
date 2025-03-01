
import { Suspense } from 'react';
import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <Suspense fallback={<div className="text-center py-10">Loading benchmark data...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}