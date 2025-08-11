import React, { createContext, useContext, useEffect, useState } from 'react';

import type { MakeGuessResponse } from '@/types/rooms';

interface GuessResult {
  guessId: string;
  exactMatches: number;
  isWinner: boolean;
}

interface GuessesResultsContextType {
  guessesResults: GuessResult[];
  addGuessResult: (result: MakeGuessResponse) => void;
  getGuessResult: (guessId: string) => GuessResult | undefined;
  clearResults: () => void;
}

const GuessesResultsContext = createContext<
  GuessesResultsContextType | undefined
>(undefined);

interface GuessesResultsProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'guesses-results';

export const GuessesResultsProvider: React.FC<GuessesResultsProviderProps> = ({
  children,
}) => {
  const [guessesResults, setGuessesResults] = useState<GuessResult[]>([]);

  const loadGuessesResults = () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GuessResult[];
        setGuessesResults(parsed);
      }
    } catch (error) {
      console.error(
        'Error loading guesses results from sessionStorage:',
        error,
      );
    }
  };

  useEffect(() => {
    loadGuessesResults();
  }, []);

  const addGuessResult = (result: MakeGuessResponse) => {
    const guessResult: GuessResult = {
      guessId: result.guessId,
      exactMatches: result.exactMatches,
      isWinner: result.exactMatches === 4,
    };

    const newGuessesResults = [...guessesResults, guessResult];

    setGuessesResults(newGuessesResults);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newGuessesResults));
  };

  const getGuessResult = (guessId: string): GuessResult | undefined => {
    return guessesResults.find((result) => result.guessId === guessId);
  };

  const clearResults = () => {
    setGuessesResults([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(
        'Error clearing guesses results from sessionStorage:',
        error,
      );
    }
  };

  return (
    <GuessesResultsContext.Provider
      value={{
        guessesResults,
        addGuessResult,
        getGuessResult,
        clearResults,
      }}
    >
      {children}
    </GuessesResultsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGuessesResults = () => {
  const context = useContext(GuessesResultsContext);
  if (!context) {
    throw new Error(
      'useGuessesResults must be used within a GuessesResultsProvider',
    );
  }
  return context;
};
