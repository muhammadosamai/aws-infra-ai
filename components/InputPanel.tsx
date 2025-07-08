
import React, { useState } from 'react';
import { InputPanelProps } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isLoading }) => {
  const [problem, setProblem] = useState('');

  const examples = [
    "A highly available and scalable web application for an e-commerce startup.",
    "A data processing pipeline for analyzing 1TB of daily log files.",
    "A serverless backend for a mobile chat application with real-time features.",
    "A secure and private network for a corporate environment with multiple departments."
  ];

  const handleExampleClick = (example: string) => {
    setProblem(example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(problem);
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-aws-squid-ink">
      <div className="flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-2">Describe Your Infrastructure Needs</h2>
        <p className="text-aws-font-color mb-6">
          Provide a detailed description of your project, application, or problem. The more detail you give, the better the solution will be.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g., I need to build a scalable backend for a photo-sharing social media app..."
            className="w-full flex-grow p-4 bg-aws-dark-charcoal border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aws-orange transition-shadow duration-200 resize-none min-h-[200px]"
            rows={10}
            disabled={isLoading}
          ></textarea>

          <button
            type="submit"
            disabled={isLoading || !problem.trim()}
            className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-aws-orange text-aws-squid-ink font-bold rounded-lg hover:bg-opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Generating...' : 'Generate Solution'}
            {!isLoading && <ChevronRightIcon className="h-5 w-5 ml-2" />}
          </button>
        </form>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-3">Or, try an example:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((ex, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(ex)}
              disabled={isLoading}
              className="text-left p-3 bg-aws-dark-charcoal border border-gray-700 rounded-md text-sm text-aws-font-color hover:bg-gray-700 hover:border-aws-cloud-blue transition-colors duration-200 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
