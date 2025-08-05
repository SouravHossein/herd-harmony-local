
import React, { createContext, useContext, ReactNode } from 'react';
import { useGoatData as useElectronData } from '@/hooks/useDatabase';
import { useGoatData as useLocalStorageData } from '@/hooks/useLocalStorageOnly';
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
  // Check if running in Electron environment
  const isElectron = window.electronAPI?.isElectron;
  
  // Use appropriate data layer based on environment
  const electronData = isElectron ? useElectronData() : null;
  const localStorageData = !isElectron ? useLocalStorageData() : null;
  
  // Use Electron data if available, otherwise localStorage
  const currentData = electronData || localStorageData!;
  
  // Utility functions that work with both data sources
  const getGoatWeightHistory = (goatId: string): WeightRecord[] => {
    return (currentData.weightRecords || []).filter((record: WeightRecord) => record.goatId === goatId);
  };

  const getGoatHealthHistory = (goatId: string): HealthRecord[] => {
    return (currentData.healthRecords || []).filter((record: HealthRecord) => record.goatId === goatId);
  };

  const getUpcomingHealthReminders = (): HealthRecord[] => {
    const records = currentData.healthRecords || [];
    const now = new Date();
    return records.filter((record: HealthRecord) => 
      record.status === 'scheduled' && 
      record.nextDueDate && 
      new Date(record.nextDueDate) >= now
    );
  };

  const exportData = async () => {
    if (isElectron && electronData) {
      return electronData.exportData();
    }
    // Browser export functionality
    const data = {
      goats: currentData.goats,
      weightRecords: currentData.weightRecords,
      healthRecords: currentData.healthRecords,
      breedingRecords: currentData.breedingRecords,
      financeRecords: currentData.financeRecords,
      feeds: currentData.feeds,
      feedPlans: currentData.feedPlans,
      feedLogs: currentData.feedLogs,
      exportDate: new Date().toISOString()
    };
    return data;
  };

  const importData = async (data: any) => {
    if (isElectron && electronData) {
      return electronData.importData(data);
    }
    // Browser import functionality
    try {
      if (data.goats) currentData.setGoats(data.goats);
      if (data.weightRecords) currentData.setWeightRecords(data.weightRecords);
      if (data.healthRecords) currentData.setHealthRecords(data.healthRecords);
      if (data.breedingRecords) currentData.setBreedingRecords(data.breedingRecords);
      if (data.financeRecords) currentData.setFinanceRecords(data.financeRecords);
      if (data.feeds) currentData.setFeeds(data.feeds);
      if (data.feedPlans) currentData.setFeedPlans(data.feedPlans);
      if (data.feedLogs) currentData.setFeedLogs(data.feedLogs);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const clearAllData = async () => {
    if (isElectron && electronData) {
      return electronData.clearAll();
    }
    // Browser clear functionality
    try {
      currentData.setGoats([]);
      currentData.setWeightRecords([]);
      currentData.setHealthRecords([]);
      currentData.setBreedingRecords([]);
      currentData.setFinanceRecords([]);
      currentData.setFeeds([]);
      currentData.setFeedPlans([]);
      currentData.setFeedLogs([]);
      return true;
    } catch (error) {
      console.error('Clear failed:', error);
      return false;
    }
  };

  const getFarmStats = () => {
    const goats = currentData.goats || [];
    const weightRecords = currentData.weightRecords || [];
    const healthRecords = currentData.healthRecords || [];

    return {
      totalGoats: goats.length,
      activeGoats: goats.filter((g: Goat) => g.status === 'active').length,
      averageWeight: weightRecords.length > 0 
        ? weightRecords.reduce((sum: number, r: WeightRecord) => sum + r.weight, 0) / weightRecords.length 
        : 0,
      upcomingReminders: getUpcomingHealthReminders().length
    };
  };
  
  // Create unified context value that works with both backends
  const contextValue: GoatContextType = {
    goats: currentData.goats || [],
    setGoats: currentData.setGoats,
    weightRecords: currentData.weightRecords || [],
    setWeightRecords: currentData.setWeightRecords,
    healthRecords: currentData.healthRecords || [],
    setHealthRecords: currentData.setHealthRecords,
    breedingRecords: currentData.breedingRecords || [],
    setBreedingRecords: currentData.setBreedingRecords,
    financeRecords: currentData.financeRecords || [],
    setFinanceRecords: currentData.setFinanceRecords,
    feeds: currentData.feeds || [],
    setFeeds: currentData.setFeeds,
    feedPlans: currentData.feedPlans || [],
    setFeedPlans: currentData.setFeedPlans,
    feedLogs: currentData.feedLogs || [],
    setFeedLogs: currentData.setFeedLogs,
    loading: currentData.loading || false,
    error: currentData.error || null,
    addGoat: currentData.addGoat,
    updateGoat: currentData.updateGoat,
    deleteGoat: currentData.deleteGoat,
    addWeightRecord: currentData.addWeightRecord,
    updateWeightRecord: currentData.updateWeightRecord,
    deleteWeightRecord: currentData.deleteWeightRecord,
    addHealthRecord: currentData.addHealthRecord,
    updateHealthRecord: currentData.updateHealthRecord,
    deleteHealthRecord: currentData.deleteHealthRecord,
    addBreedingRecord: currentData.addBreedingRecord,
    updateBreedingRecord: currentData.updateBreedingRecord,
    deleteBreedingRecord: currentData.deleteBreedingRecord,
    addFinanceRecord: currentData.addFinanceRecord,
    updateFinanceRecord: currentData.updateFinanceRecord,
    deleteFinanceRecord: currentData.deleteFinanceRecord,
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
