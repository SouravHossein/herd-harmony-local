
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useGoatData() {
  const [goats, setGoats] = useLocalStorage('goats', []);
  const [weightRecords, setWeightRecords] = useLocalStorage('weightRecords', []);
  const [healthRecords, setHealthRecords] = useLocalStorage('healthRecords', []);
  const [breedingRecords, setBreedingRecords] = useLocalStorage('breedingRecords', []);
  const [financeRecords, setFinanceRecords] = useLocalStorage('financeRecords', []);
  const [feeds, setFeeds] = useLocalStorage('feeds', []);
  const [feedPlans, setFeedPlans] = useLocalStorage('feedPlans', []);
  const [feedLogs, setFeedLogs] = useLocalStorage('feedLogs', []);

  // Simulate async operations for consistency with Electron API
  const addGoat = async (goat: any) => {
    const newGoat = { ...goat, id: goat.id || uuidv4(), createdAt: new Date().toISOString() };
    setGoats((prev: any[]) => [...prev, newGoat]);
    return newGoat;
  };

  const updateGoat = async (id: string, updates: any) => {
    setGoats((prev: any[]) => 
      prev.map(goat => goat.id === id ? { ...goat, ...updates } : goat)
    );
    return { id, ...updates };
  };

  const deleteGoat = async (id: string) => {
    setGoats((prev: any[]) => prev.filter(goat => goat.id !== id));
    // Also clean up related records
    setWeightRecords((prev: any[]) => prev.filter(record => record.goatId !== id));
    setHealthRecords((prev: any[]) => prev.filter(record => record.goatId !== id));
    return true;
  };

  const addWeightRecord = async (record: any) => {
    const newRecord = { ...record, id: record.id || uuidv4(), createdAt: new Date().toISOString() };
    setWeightRecords((prev: any[]) => [...prev, newRecord]);
    return newRecord;
  };

  const updateWeightRecord = async (id: string, updates: any) => {
    setWeightRecords((prev: any[]) => 
      prev.map(record => record.id === id ? { ...record, ...updates } : record)
    );
    return { id, ...updates };
  };

  const deleteWeightRecord = async (id: string) => {
    setWeightRecords((prev: any[]) => prev.filter(record => record.id !== id));
    return true;
  };

  const addHealthRecord = async (record: any) => {
    const newRecord = { ...record, id: record.id || uuidv4(), createdAt: new Date().toISOString() };
    setHealthRecords((prev: any[]) => [...prev, newRecord]);
    return newRecord;
  };

  const updateHealthRecord = async (id: string, updates: any) => {
    setHealthRecords((prev: any[]) => 
      prev.map(record => record.id === id ? { ...record, ...updates } : record)
    );
    return { id, ...updates };
  };

  const deleteHealthRecord = async (id: string) => {
    setHealthRecords((prev: any[]) => prev.filter(record => record.id !== id));
    return true;
  };

  const addBreedingRecord = async (record: any) => {
    const newRecord = { ...record, id: record.id || uuidv4(), createdAt: new Date().toISOString() };
    setBreedingRecords((prev: any[]) => [...prev, newRecord]);
    return newRecord;
  };

  const updateBreedingRecord = async (id: string, updates: any) => {
    setBreedingRecords((prev: any[]) => 
      prev.map(record => record.id === id ? { ...record, ...updates } : record)
    );
    return { id, ...updates };
  };

  const deleteBreedingRecord = async (id: string) => {
    setBreedingRecords((prev: any[]) => prev.filter(record => record.id !== id));
    return true;
  };

  const addFinanceRecord = async (record: any) => {
    const newRecord = { ...record, id: record.id || uuidv4(), createdAt: new Date().toISOString() };
    setFinanceRecords((prev: any[]) => [...prev, newRecord]);
    return newRecord;
  };

  const updateFinanceRecord = async (id: string, updates: any) => {
    setFinanceRecords((prev: any[]) => 
      prev.map(record => record.id === id ? { ...record, ...updates } : record)
    );
    return { id, ...updates };
  };

  const deleteFinanceRecord = async (id: string) => {
    setFinanceRecords((prev: any[]) => prev.filter(record => record.id !== id));
    return true;
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
    loading: false,
    error: null,
    addGoat,
    updateGoat,
    deleteGoat,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addBreedingRecord,
    updateBreedingRecord,
    deleteBreedingRecord,
    addFinanceRecord,
    updateFinanceRecord,
    deleteFinanceRecord,
  };
}
