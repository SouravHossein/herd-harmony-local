
import { useState, useEffect } from 'react';

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function useLocalStorageOnly<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getLocalStorageItem(key, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setLocalStorageItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useGoatDataLocal() {
  const [goats, setGoats] = useLocalStorageOnly('goats', []);
  const [weightRecords, setWeightRecords] = useLocalStorageOnly('weightRecords', []);
  const [healthRecords, setHealthRecords] = useLocalStorageOnly('healthRecords', []);
  const [breedingRecords, setBreedingRecords] = useLocalStorageOnly('breedingRecords', []);
  const [financeRecords, setFinanceRecords] = useLocalStorageOnly('financeRecords', []);
  const [feeds, setFeeds] = useLocalStorageOnly('feeds', []);
  const [feedPlans, setFeedPlans] = useLocalStorageOnly('feedPlans', []);
  const [feedLogs, setFeedLogs] = useLocalStorageOnly('feedLogs', []);

  // Generate ID utility
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addGoat = (goat: any) => {
    const newGoat = { ...goat, id: generateId(), createdAt: new Date(), updatedAt: new Date() };
    setGoats(prev => [...prev, newGoat]);
    return newGoat;
  };

  const updateGoat = (id: string, updates: any) => {
    setGoats(prev => prev.map(goat => 
      goat.id === id ? { ...goat, ...updates, updatedAt: new Date() } : goat
    ));
  };

  const deleteGoat = (id: string) => {
    setGoats(prev => prev.filter(goat => goat.id !== id));
    // Also clean up related records
    setWeightRecords(prev => prev.filter(record => record.goatId !== id));
    setHealthRecords(prev => prev.filter(record => record.goatId !== id));
  };

  return {
    goats,
    setGoats,
    weightRecords,
    setWeightRecords,
    healthRecords,
    setHealthRecords,
    breedingRecords,
    setBreedingRecords,
    financeRecords,
    setFinanceRecords,
    feeds,
    setFeeds,
    feedPlans,
    setFeedPlans,
    feedLogs,
    setFeedLogs,
    addGoat,
    updateGoat,
    deleteGoat,
    loading: false,
    error: null
  };
}
