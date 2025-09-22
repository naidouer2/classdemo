'use client';

import PomodoroPage from '@/components/pomodoro/PomodoroPage';

export default function PomodoroPageRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            番茄钟
          </h1>
          <p className="text-gray-600">
            专注工作，高效休息
          </p>
        </div>
        
        <PomodoroPage />
      </div>
    </div>
  );
}