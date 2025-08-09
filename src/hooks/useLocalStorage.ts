import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Game progress interface for localStorage
export interface GameProgress {
  player: {
    name: string;
    level: number;
    experience: number;
    skills: { [key: string]: number };
  };
  missions: {
    [missionId: string]: {
      isCompleted: boolean;
      completedAt?: number;
      score?: number;
      timeSpent?: number;
    };
  };
  challenges: {
    [challengeId: string]: {
      attempts: number;
      isCompleted: boolean;
      bestScore?: number;
      bestTime?: number;
      completedAt?: number;
    };
  };
  settings: {
    soundEnabled: boolean;
    theme: 'light' | 'dark';
    difficulty: 'easy' | 'medium' | 'hard';
  };
  statistics: {
    totalPlayTime: number;
    challengesCompleted: number;
    totalScore: number;
    achievements: string[];
  };
}

export const defaultGameProgress: GameProgress = {
  player: {
    name: 'Crypto Learner',
    level: 1,
    experience: 0,
    skills: {
      threshold: 0,
      vrf: 0,
      blocklock: 0,
      dcipher: 0,
    },
  },
  missions: {},
  challenges: {},
  settings: {
    soundEnabled: true,
    theme: 'dark',
    difficulty: 'medium',
  },
  statistics: {
    totalPlayTime: 0,
    challengesCompleted: 0,
    totalScore: 0,
    achievements: [],
  },
};
