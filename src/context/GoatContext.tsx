
import React, { createContext, useContext, ReactNode } from 'react';
import { useGoatData } from '@/hooks/useDatabase';
import { useGoatDataLocal } from '@/hooks/useLocalStorageOnly';
import { Goat, WeightRecord, HealthRecord, BreedingRecord, Feed, FeedPlan, FeedLog } from '@/types/goat';

interface GoatContextType {
  goats: Goat[];
  setGoats: React.Dispatch<React.SetStateAction<Goat[]>>;
  weightRecords: WeightRecord[];
  setWeightRecords: React.Dispatch<React.SetStateAction<WeightRecord[]>>;
  healthRecords: HealthRecord[];
  setHealthRecords: React.Dispatch<React.SetStateAction<HealthRecord[]>>;
  breedingRecords: BreedingRecord[];
  setBreedingRecords: React.Dispatch<React.SetStateAction<BreedingRecord[]>>;
  financeRecords: any[];
  setFinanceRecords: React.Dispatch<React.SetStateAction<any[]>>;
  feeds: Feed[];
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  feedPlans: FeedPlan[];
  setFeedPlans: React.Dispatch<React.SetStateAction<FeedPlan[]>>;
  feedLogs: FeedLog[];
  setFeedLogs: React.Dispatch<React.SetStateAction<FeedLog[]>>;
  loading: boolean;
  error: string | null;
  addGoat: (goat: any) => Promise<any>;
  updateGoat: (id: string, updates: any) => Promise<any>;
  deleteGoat: (id: string) => Promise<boolean>;
  addWeightRecord: (record: any) => Promise<any>;
  updateWeightRecord: (id: string, updates: any) => Promise<any>;
  deleteWeightRecord: (id: string) => Promise<boolean>;
  addHealthRecord: (record: any) => Promise<any>;
  updateHealthRecord: (id: string, updates: any) => Promise<any>;
  deleteHealthRecord: (id: string) => Promise<boolean>;
  addBreedingRecord: (record: any) => Promise<any>;
  updateBreedingRecord: (id: string, updates: any) => Promise<any>;
  deleteBreedingRecord: (id: string) => Promise<boolean>;
  addFinanceRecord: (record: any) => Promise<any>;
  updateFinanceRecord: (id: string, updates: any) => Promise<any>;
  deleteFinanceRecord: (id: string) => Promise<boolean>;
  getGoatWeightHistory: (goatId: string) => WeightRecord[];
  getGoatHealthHistory: (goatId: string) => HealthRecord[];
  getUpcomingHealthReminders: () => HealthRecord[];
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  getFarmStats: () => any;
}

const GoatContext = createContext<GoatContextType | undefined>(undefined);

export function GoatProvider({ children }: { children: ReactNode }) {
  const isElectronAvailable = Boolean(window.electronAPI?.isElectron);
  
  // Use appropriate hook based on backend availability
  const electronData = useGoatData();
  const localData = useGoatDataLocal();
  
  // Utility functions that work with both data sources
  const getGoatWeightHistory = (goatId: string): WeightRecord[] => {
    const records = isElectronAvailable ? electronData.weightRecords || [] : localData.weightRecords;
    return records.filter((record: WeightRecord) => record.goatId === goatId);
  };

  const getGoatHealthHistory = (goatId: string): HealthRecord[] => {
    const records = isElectronAvailable ? electronData.healthRecords || [] : localData.healthRecords;
    return records.filter((record: HealthRecord) => record.goatId === goatId);
  };

  const getUpcomingHealthReminders = (): HealthRecord[] => {
    const records = isElectronAvailable ? electronData.healthRecords || [] : localData.healthRecords;
    const now = new Date();
    return records.filter((record: HealthRecord) => 
      record.status === 'scheduled' && 
      record.nextDueDate && 
      new Date(record.nextDueDate) >= now
    );
  };

  const exportData = async () => {
    const data = {
      goats: isElectronAvailable ? electronData.goats : localData.goats,
      weightRecords: isElectronAvailable ? electronData.weightRecords : localData.weightRecords,
      healthRecords: isElectronAvailable ? electronData.healthRecords : localData.healthRecords,
      breedingRecords: isElectronAvailable ? electronData.breedingRecords : localData.breedingRecords,
      financeRecords: isElectronAvailable ? electronData.financeRecords : localData.financeRecords,
    };
    return data;
  };

  const importData = async (data: any) => {
    if (isElectronAvailable) {
      // Handle Electron import
      return false;
    } else {
      localData.setGoats(data.goats || []);
      localData.setWeightRecords(data.weightRecords || []);
      localData.setHealthRecords(data.healthRecords || []);
      localData.setBreedingRecords(data.breedingRecords || []);
      localData.setFinanceRecords(data.financeRecords || []);
      return true;
    }
  };

  const clearAllData = async () => {
    if (isElectronAvailable) {
      return false;
    } else {
      localData.setGoats([]);
      localData.setWeightRecords([]);
      localData.setHealthRecords([]);
      localData.setBreedingRecords([]);
      localData.setFinanceRecords([]);
      return true;
    }
  };

  const getFarmStats = () => {
    const goats = isElectronAvailable ? electronData.goats || [] : localData.goats;
    const weightRecords = isElectronAvailable ? electronData.weightRecords || [] : localData.weightRecords;
    const healthRecords = isElectronAvailable ? electronData.healthRecords || [] : localData.healthRecords;

    return {
      totalGoats: goats.length,
      activeGoats: goats.filter((g: Goat) => g.status === 'active').length,
      averageWeight: weightRecords.length > 0 
        ? weightRecords.reduce((sum: number, r: WeightRecord) => sum + r.weight, 0) / weightRecords.length 
        : 0,
      upcomingReminders: getUpcomingHealthReminders().length
    };
  };
  
  // Choose data source based on availability
  const contextValue = isElectronAvailable ? {
    goats: electronData.goats || [],
    setGoats: () => {},
    weightRecords: electronData.weightRecords || [],
    setWeightRecords: () => {},
    healthRecords: electronData.healthRecords || [],
    setHealthRecords: () => {},
    breedingRecords: electronData.breedingRecords || [],
    setBreedingRecords: () => {},
    financeRecords: electronData.financeRecords || [],
    setFinanceRecords: () => {},
    feeds: electronData.feeds || [],
    setFeeds: () => {},
    feedPlans: electronData.feedPlans || [],
    setFeedPlans: () => {},
    feedLogs: electronData.feedLogs || [],
    setFeedLogs: () => {},
    loading: electronData.loading || false,
    error: electronData.error || null,
    addGoat: electronData.addGoat,
    updateGoat: electronData.updateGoat,
    deleteGoat: electronData.deleteGoat,
    addWeightRecord: electronData.addWeightRecord,
    updateWeightRecord: electronData.updateWeightRecord,
    deleteWeightRecord: electronData.deleteWeightRecord,
    addHealthRecord: electronData.addHealthRecord,
    updateHealthRecord: electronData.updateHealthRecord,
    deleteHealthRecord: electronData.deleteHealthRecord,
    addBreedingRecord: electronData.addBreedingRecord,
    updateBreedingRecord: electronData.updateBreedingRecord,
    deleteBreedingRecord: electronData.deleteBreedingRecord,
    addFinanceRecord: electronData.addFinanceRecord,
    updateFinanceRecord: electronData.updateFinanceRecord,
    deleteFinanceRecord: electronData.deleteFinanceRecord,
    getGoatWeightHistory,
    getGoatHealthHistory,
    getUpcomingHealthReminders,
    exportData,
    importData,
    clearAllData,
    getFarmStats
  } : {
    goats: localData.goats,
    setGoats: localData.setGoats,
    weightRecords: localData.weightRecords,
    setWeightRecords: localData.setWeightRecords,
    healthRecords: localData.healthRecords,
    setHealthRecords: localData.setHealthRecords,
    breedingRecords: localData.breedingRecords,
    setBreedingRecords: localData.setBreedingRecords,
    financeRecords: localData.financeRecords,
    setFinanceRecords: localData.setFinanceRecords,
    feeds: localData.feeds,
    setFeeds: localData.setFeeds,
    feedPlans: localData.feedPlans,
    setFeedPlans: localData.setFeedPlans,
    feedLogs: localData.feedLogs,
    setFeedLogs: localData.setFeedLogs,
    loading: localData.loading,
    error: localData.error,
    addGoat: localData.addGoat,
    updateGoat: localData.updateGoat,
    deleteGoat: localData.deleteGoat,
    addWeightRecord: async (record: any) => { 
      const newRecord = { ...record, id: Date.now().toString(), createdAt: new Date() };
      localData.setWeightRecords(prev => [...prev, newRecord]);
      return newRecord;
    },
    updateWeightRecord: async (id: string, updates: any) => {
      localData.setWeightRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      return null;
    },
    deleteWeightRecord: async (id: string) => {
      localData.setWeightRecords(prev => prev.filter(r => r.id !== id));
      return true;
    },
    addHealthRecord: async (record: any) => {
      const newRecord = { ...record, id: Date.now().toString(), createdAt: new Date() };
      localData.setHealthRecords(prev => [...prev, newRecord]);
      return newRecord;
    },
    updateHealthRecord: async (id: string, updates: any) => {
      localData.setHealthRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      return null;
    },
    deleteHealthRecord: async (id: string) => {
      localData.setHealthRecords(prev => prev.filter(r => r.id !== id));
      return true;
    },
    addBreedingRecord: async (record: any) => {
      const newRecord = { ...record, id: Date.now().toString(), createdAt: new Date() };
      localData.setBreedingRecords(prev => [...prev, newRecord]);
      return newRecord;
    },
    updateBreedingRecord: async (id: string, updates: any) => {
      localData.setBreedingRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      return null;
    },
    deleteBreedingRecord: async (id: string) => {
      localData.setBreedingRecords(prev => prev.filter(r => r.id !== id));
      return true;
    },
    addFinanceRecord: async (record: any) => {
      const newRecord = { ...record, id: Date.now().toString(), createdAt: new Date() };
      localData.setFinanceRecords(prev => [...prev, newRecord]);
      return newRecord;
    },
    updateFinanceRecord: async (id: string, updates: any) => {
      localData.setFinanceRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      return null;
    },
    deleteFinanceRecord: async (id: string) => {
      localData.setFinanceRecords(prev => prev.filter(r => r.id !== id));
      return true;
    },
    getGoatWeightHistory,
    getGoatHealthHistory,
    getUpcomingHealthReminders,
    exportData,
    importData,
    clearAllData,
    getFarmStats
  };

  return (
    <GoatContext.Provider value={contextValue}>
      {children}
    </GoatContext.Provider>
  );
}

export function useGoatContext() {
  const context = useContext(GoatContext);
  if (context === undefined) {
    throw new Error("useGoatContext must be used within a GoatProvider");
  }
  return context;
}
