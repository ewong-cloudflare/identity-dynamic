import React from 'react';
import Setup from '../components/setup';

const SetupPage = () => {
  return (
    <div className="bg-steel min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-dark">
          Theme Setup
        </h1>
        <Setup />
      </div>
    </div>
  );
};

export default SetupPage;