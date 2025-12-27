'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {showWelcome && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Login successful! Welcome back.
        </div>
      )}
      <h1 className="text-4xl font-bold text-gray-800">This is the Dashboard Page</h1>
    </div>
  );
}