import React, { createContext, useContext, ReactNode } from 'react';
import { Goat, WeightRecord, HealthRecord, BreedingRecord, FarmStats } from '@/types/goat';
import { useGoatData } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';

interface GoatContextType {
  // Data
  goats: Goat[];
  weightRecords: WeightRecord[];
  healthRecords: HealthRecord[];
  breedingRecords: BreedingRecord[];
  
  // Actions
  addGoat: (goat: Omit<Goat, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoat: (id: string, updates: Partial<Goat>) => void;
  deleteGoat: (id: string) => void;
  
  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => void;
  updateWeightRecord: (id: string, updates: Partial<WeightRecord>) => void;
  deleteWeightRecord: (id: string) => void;
  
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  
  addBreedingRecord: (record: Omit<BreedingRecord, 'id'>) => void;
  updateBreedingRecord: (id: string, updates: Partial<BreedingRecord>) => void;
  deleteBreedingRecord: (id: string) => void;
  
  // Computed data
  getFarmStats: () => FarmStats;
  getGoatWeightHistory: (goatId: string) => WeightRecord[];
  getGoatHealthHistory: (goatId: string) => HealthRecord[];
  getUpcomingHealthReminders: () => HealthRecord[];
  
  // Data management
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
}

const GoatContext = createContext<GoatContextType | undefined>(undefined);

export function GoatProvider({ children }: { children: ReactNode }) {
  const {
    goats,
    setGoats,
    weightRecords,
    setWeightRecords,
    healthRecords,
    setHealthRecords,
    breedingRecords,
    setBreedingRecords,
  } = useGoatData();

  // Goat management
  const addGoat = (goatData: Omit<Goat, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoat: Goat = {
      ...goatData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setGoats((prev: Goat[]) => [...prev, newGoat]);
  };

  const updateGoat = (id: string, updates: Partial<Goat>) => {
    setGoats((prev: Goat[]) =>
      prev.map((goat) =>
        goat.id === id ? { ...goat, ...updates, updatedAt: new Date() } : goat
      )
    );
  };

  const deleteGoat = (id: string) => {
    setGoats((prev: Goat[]) => prev.filter((goat) => goat.id !== id));
    // Also clean up related records
    setWeightRecords((prev: WeightRecord[]) => prev.filter((record) => record.goatId !== id));
    setHealthRecords((prev: HealthRecord[]) => prev.filter((record) => record.goatId !== id));
  };

  // Weight record management
  const addWeightRecord = (recordData: Omit<WeightRecord, 'id'>) => {
    const newRecord: WeightRecord = {
      ...recordData,
      id: generateId(),
    };
    setWeightRecords((prev: WeightRecord[]) => [...prev, newRecord]);
  };

  const updateWeightRecord = (id: string, updates: Partial<WeightRecord>) => {
    setWeightRecords((prev: WeightRecord[]) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const deleteWeightRecord = (id: string) => {
    setWeightRecords((prev: WeightRecord[]) => prev.filter((record) => record.id !== id));
  };

  // Health record management
  const addHealthRecord = (recordData: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: generateId(),
    };
    setHealthRecords((prev: HealthRecord[]) => [...prev, newRecord]);
  };

  const updateHealthRecord = (id: string, updates: Partial<HealthRecord>) => {
    setHealthRecords((prev: HealthRecord[]) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords((prev: HealthRecord[]) => prev.filter((record) => record.id !== id));
  };

  // Breeding record management
  const addBreedingRecord = (recordData: Omit<BreedingRecord, 'id'>) => {
    const newRecord: BreedingRecord = {
      ...recordData,
      id: generateId(),
    };
    setBreedingRecords((prev: BreedingRecord[]) => [...prev, newRecord]);
  };

  const updateBreedingRecord = (id: string, updates: Partial<BreedingRecord>) => {
    setBreedingRecords((prev: BreedingRecord[]) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const deleteBreedingRecord = (id: string) => {
    setBreedingRecords((prev: BreedingRecord[]) => prev.filter((record) => record.id !== id));
  };

  // Computed data functions
  const getFarmStats = (): FarmStats => {
    const activeGoats = goats.filter((goat) => goat.status === 'active');
    const currentYear = new Date().getFullYear();
    const kidsBornThisYear = goats.filter(
      (goat) => new Date(goat.dateOfBirth).getFullYear() === currentYear
    ).length;

    const breedDistribution = goats.reduce((acc, goat) => {
      acc[goat.breed] = (acc[goat.breed] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const upcomingReminders = getUpcomingHealthReminders().length;

    const recentWeights = weightRecords.filter(
      (record) => new Date(record.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const averageWeight = recentWeights.length > 0
      ? recentWeights.reduce((sum, record) => sum + record.weight, 0) / recentWeights.length
      : 0;

    return {
      totalGoats: goats.length,
      activeGoats: activeGoats.length,
      maleGoats: goats.filter((goat) => goat.gender === 'male').length,
      femaleGoats: goats.filter((goat) => goat.gender === 'female').length,
      kidsBornThisYear,
      upcomingHealthReminders: upcomingReminders,
      averageWeight: Math.round(averageWeight * 10) / 10,
      breedDistribution,
    };
  };

  const getGoatWeightHistory = (goatId: string): WeightRecord[] => {
    return weightRecords
      .filter((record) => record.goatId === goatId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getGoatHealthHistory = (goatId: string): HealthRecord[] => {
    return healthRecords
      .filter((record) => record.goatId === goatId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUpcomingHealthReminders = (): HealthRecord[] => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return healthRecords.filter((record) => {
      if (!record.nextDueDate) return false;
      const dueDate = new Date(record.nextDueDate);
      return dueDate >= now && dueDate <= thirtyDaysFromNow;
    });
  };

  // Data management
  const exportData = (): string => {
    const data = {
      goats,
      weightRecords,
      healthRecords,
      breedingRecords,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.goats || !Array.isArray(data.goats)) {
        throw new Error('Invalid data format: missing goats array');
      }

      setGoats(data.goats || []);
      setWeightRecords(data.weightRecords || []);
      setHealthRecords(data.healthRecords || []);
      setBreedingRecords(data.breedingRecords || []);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const clearAllData = () => {
    setGoats([]);
    setWeightRecords([]);
    setHealthRecords([]);
    setBreedingRecords([]);
  };

  const value: GoatContextType = {
    goats,
    weightRecords,
    healthRecords,
    breedingRecords,
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
    getFarmStats,
    getGoatWeightHistory,
    getGoatHealthHistory,
    getUpcomingHealthReminders,
    exportData,
    importData,
    clearAllData,
  };

  return <GoatContext.Provider value={value}>{children}</GoatContext.Provider>;
}

export function useGoatContext() {
  const context = useContext(GoatContext);
  if (context === undefined) {
    throw new Error('useGoatContext must be used within a GoatProvider');
  }
  return context;
}