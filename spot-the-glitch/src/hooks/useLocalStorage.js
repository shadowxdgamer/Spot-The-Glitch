import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spotTheGlitch_highScore';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// High score specific hook
export const useHighScore = () => {
  const [highScoreData, setHighScoreData] = useLocalStorage(STORAGE_KEY, {
    highScore: 0,
    lastPlayed: null,
    gamesPlayed: 0
  });

  const updateHighScore = (newScore) => {
    setHighScoreData(prev => ({
      highScore: Math.max(prev.highScore, newScore),
      lastPlayed: new Date().toISOString(),
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  const resetHighScore = () => {
    setHighScoreData({
      highScore: 0,
      lastPlayed: null,
      gamesPlayed: 0
    });
  };

  return {
    highScore: highScoreData.highScore,
    lastPlayed: highScoreData.lastPlayed,
    gamesPlayed: highScoreData.gamesPlayed,
    updateHighScore,
    resetHighScore
  };
};
