
import React, { useState, useCallback } from 'react';
import InputPanel from './components/InputPanel';
import SolutionDisplay from './components/SolutionDisplay';
import { generateSolutionStream } from './services/geminiService';
import { AwsIcon } from './components/icons/AwsIcon';
import { Source } from './types';

const App: React.FC = () => {
  const [solution, setSolution] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSolution = useCallback(async (problemStatement: string) => {
    if (!problemStatement.trim()) {
      setError("Please enter a problem statement.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSolution(null);
    setSources([]);

    try {
      await generateSolutionStream(
        problemStatement,
        (textChunk) => {
          setSolution((prev) => (prev ?? '') + textChunk);
        },
        (updatedSources) => {
          setSources(updatedSources);
        },
        (e) => {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
          setError(`Failed to generate solution. ${errorMessage}`);
          console.error(e);
        }
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate solution. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-aws-squid-ink text-aws-font-color font-sans">
      <header className="bg-aws-dark-charcoal p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AwsIcon className="h-10 w-10 text-aws-orange" />
          <h1 className="text-2xl font-bold text-white">
            AWS Cloud Architect AI
          </h1>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-73px)]">
        <div className="lg:border-r border-gray-700">
          <InputPanel onGenerate={handleGenerateSolution} isLoading={isLoading} />
        </div>
        <div className="bg-aws-dark-charcoal">
          <SolutionDisplay solution={solution} isLoading={isLoading} error={error} sources={sources} />
        </div>
      </main>
    </div>
  );
};

export default App;
