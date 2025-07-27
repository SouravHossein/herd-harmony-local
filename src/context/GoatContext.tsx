import React, { createContext, useContext, ReactNode } from 'react';
import { Goat, WeightRecord, HealthRecord, BreedingRecord, FarmStats } from '@/types/goat';
import { useGoatData } from '@/hooks/useDatabase';
import { generateId } from '@/lib/utils';

interface GoatContextType {
  // Data
  goats: Goat[];
  weightRecords: WeightRecord[];
  healthRecords: HealthRecord[];
  breedingRecords: BreedingRecord[];
  
  // Actions
  addGoat: (goat: Omit<Goat, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateGoat: (id: string, updates: Partial<Goat>) => Promise<any>;
  deleteGoat: (id: string) => Promise<boolean>;
  
  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => Promise<any>;
  updateWeightRecord: (id: string, updates: Partial<WeightRecord>) => Promise<any>;
  deleteWeightRecord: (id: string) => Promise<boolean>;
  
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<any>;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => Promise<any>;
  deleteHealthRecord: (id: string) => Promise<boolean>;
  
  addBreedingRecord: (record: Omit<BreedingRecord, 'id'>) => Promise<any>;
  updateBreedingRecord: (id: string, updates: Partial<BreedingRecord>) => Promise<any>;
  deleteBreedingRecord: (id: string) => Promise<boolean>;
  
  // Computed data
  getFarmStats: () => FarmStats;
  getGoatWeightHistory: (goatId: string) => WeightRecord[];
  getGoatHealthHistory: (goatId: string) => HealthRecord[];
  getUpcomingHealthReminders: () => HealthRecord[];
  
  // Data management
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
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
    loading,
    // Electron operations
    addGoat: dbAddGoat,
    updateGoat: dbUpdateGoat,
    deleteGoat: dbDeleteGoat,
    addWeightRecord: dbAddWeightRecord,
    updateWeightRecord: dbUpdateWeightRecord,
    deleteWeightRecord: dbDeleteWeightRecord,
    addHealthRecord: dbAddHealthRecord,
    updateHealthRecord: dbUpdateHealthRecord,
    deleteHealthRecord: dbDeleteHealthRecord,
    addBreedingRecord: dbAddBreedingRecord,
    updateBreedingRecord: dbUpdateBreedingRecord,
    deleteBreedingRecord: dbDeleteBreedingRecord,
    exportData: dbExportData,
    importData: dbImportData,
    clearAll: dbClearAll,
  } = useGoatData();

  // Check if we're in Electron
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;

  // Goat management
  const addGoat = async (goatData: Omit<Goat, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isElectron) {
      const goatWithDates = {
        ...goatData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await dbAddGoat(goatWithDates);
    } else {
      const newGoat: Goat = {
        ...goatData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setGoats((prev: Goat[]) => [...prev, newGoat]);
      return newGoat;
    }
  };

  const updateGoat = async (id: string, updates: Partial<Goat>) => {
    if (isElectron) {
      const updatesWithDate = { ...updates, updatedAt: new Date() };
      return await dbUpdateGoat(id, updatesWithDate);
    } else {
      setGoats((prev: Goat[]) =>
        prev.map((goat) =>
          goat.id === id ? { ...goat, ...updates, updatedAt: new Date() } : goat
        )
      );
    }
  };

  const deleteGoat = async (id: string) => {
    if (isElectron) {
      return await dbDeleteGoat(id);
    } else {
      setGoats((prev: Goat[]) => prev.filter((goat) => goat.id !== id));
      // Also clean up related records
      setWeightRecords((prev: WeightRecord[]) => prev.filter((record) => record.goatId !== id));
      setHealthRecords((prev: HealthRecord[]) => prev.filter((record) => record.goatId !== id));
      return true;
    }
  };

  // Weight record management
  const addWeightRecord = async (recordData: Omit<WeightRecord, 'id'>) => {
    if (isElectron) {
      return await dbAddWeightRecord(recordData);
    } else {
      const newRecord: WeightRecord = {
        ...recordData,
        id: generateId(),
      };
      setWeightRecords((prev: WeightRecord[]) => [...prev, newRecord]);
      return newRecord;
    }
  };

  const updateWeightRecord = async (id: string, updates: Partial<WeightRecord>) => {
    if (isElectron) {
      return await dbUpdateWeightRecord(id, updates);
    } else {
      setWeightRecords((prev: WeightRecord[]) =>
        prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
      );
    }
  };

  const deleteWeightRecord = async (id: string) => {
    if (isElectron) {
      return await dbDeleteWeightRecord(id);
    } else {
      setWeightRecords((prev: WeightRecord[]) => prev.filter((record) => record.id !== id));
      return true;
    }
  };

  // Health record management
  const addHealthRecord = async (recordData: Omit<HealthRecord, 'id'>) => {
    if (isElectron) {
      return await dbAddHealthRecord(recordData);
    } else {
      const newRecord: HealthRecord = {
        ...recordData,
        id: generateId(),
      };
      setHealthRecords((prev: HealthRecord[]) => [...prev, newRecord]);
      return newRecord;
    }
  };

  const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>) => {
    if (isElectron) {
      return await dbUpdateHealthRecord(id, updates);
    } else {
      setHealthRecords((prev: HealthRecord[]) =>
        prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
      );
    }
  };

  const deleteHealthRecord = async (id: string) => {
    if (isElectron) {
      return await dbDeleteHealthRecord(id);
    } else {
      setHealthRecords((prev: HealthRecord[]) => prev.filter((record) => record.id !== id));
      return true;
    }
  };

  // Breeding record management
  const addBreedingRecord = async (recordData: Omit<BreedingRecord, 'id'>) => {
    if (isElectron) {
      return await dbAddBreedingRecord(recordData);
    } else {
      const newRecord: BreedingRecord = {
        ...recordData,
        id: generateId(),
      };
      setBreedingRecords((prev: BreedingRecord[]) => [...prev, newRecord]);
      return newRecord;
    }
  };

  const updateBreedingRecord = async (id: string, updates: Partial<BreedingRecord>) => {
    if (isElectron) {
      return await dbUpdateBreedingRecord(id, updates);
    } else {
      setBreedingRecords((prev: BreedingRecord[]) =>
        prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
      );
    }
  };

  const deleteBreedingRecord = async (id: string) => {
    if (isElectron) {
      return await dbDeleteBreedingRecord(id);
    } else {
      setBreedingRecords((prev: BreedingRecord[]) => prev.filter((record) => record.id !== id));
      return true;
    }
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
  const exportData = async (): Promise<string> => {
    if (isElectron) {
      const data = await dbExportData();
      return JSON.stringify(data, null, 2);
    } else {
      const data = {
        goats,
        weightRecords,
        healthRecords,
        breedingRecords,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };
      return JSON.stringify(data, null, 2);
    }
  };

  const importData = async (jsonData: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.goats || !Array.isArray(data.goats)) {
        throw new Error('Invalid data format: missing goats array');
      }

      if (isElectron) {
        return await dbImportData(data);
      } else {
        setGoats(data.goats || []);
        setWeightRecords(data.weightRecords || []);
        setHealthRecords(data.healthRecords || []);
        setBreedingRecords(data.breedingRecords || []);
        return true;
      }
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const clearAllData = async () => {
    if (isElectron) {
      return await dbClearAll();
    } else {
      setGoats([]);
      setWeightRecords([]);
      setHealthRecords([]);
      setBreedingRecords([]);
      return true;
    }
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