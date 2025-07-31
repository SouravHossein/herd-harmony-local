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
}

const GoatContext = createContext<GoatContextType | undefined>(undefined);

export function GoatProvider({ children }: { children: ReactNode }) {
  const isElectronAvailable = Boolean(window.electronAPI?.isElectron);
  
  // Use appropriate hook based on backend availability
  const electronData = useGoatData();
  const localData = useGoatDataLocal();
  
  // Choose data source based on availability
  const contextValue = isElectronAvailable ? {
    goats: electronData.goats.data,
    setGoats: electronData.goats.setData,
    weightRecords: electronData.weightRecords.data,
    setWeightRecords: electronData.weightRecords.setData,
    healthRecords: electronData.healthRecords.data,
    setHealthRecords: electronData.healthRecords.setData,
    breedingRecords: electronData.breedingRecords.data,
    setBreedingRecords: electronData.breedingRecords.setData,
    financeRecords: electronData.financeRecords.data,
    setFinanceRecords: electronData.financeRecords.setData,
    feeds: electronData.feeds.data,
    setFeeds: electronData.feeds.setData,
    feedPlans: electronData.feedPlans.data,
    setFeedPlans: electronData.feedPlans.setData,
    feedLogs: electronData.feedLogs.data,
    setFeedLogs: electronData.feedLogs.setData,
    loading: electronData.goats.loading || electronData.weightRecords.loading || electronData.healthRecords.loading || electronData.breedingRecords.loading,
    error: electronData.goats.error || electronData.weightRecords.error || electronData.healthRecords.error || electronData.breedingRecords.error,
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
  } : {
    goats: localData.goats,
    weightRecords: localData.weightRecords,
    healthRecords: localData.healthRecords,
    breedingRecords: localData.breedingRecords,
    financeRecords: localData.financeRecords,
    feeds: localData.feeds,
    feedPlans: localData.feedPlans,
    feedLogs: localData.feedLogs,
    loading: localData.loading,
    error: localData.error,
    addGoat: localData.addGoat,
    updateGoat: localData.updateGoat,
    deleteGoat: localData.deleteGoat,
    // Add stubs for other operations
    addWeightRecord: (record: any) => Promise.resolve(null),
    updateWeightRecord: (id: string, updates: any) => Promise.resolve(null),
    deleteWeightRecord: (id: string) => Promise.resolve(false),
    addHealthRecord: (record: any) => Promise.resolve(null),
    updateHealthRecord: (id: string, updates: any) => Promise.resolve(null),
    deleteHealthRecord: (id: string) => Promise.resolve(false),
    addBreedingRecord: (record: any) => Promise.resolve(null),
    updateBreedingRecord: (id: string, updates: any) => Promise.resolve(null),
    deleteBreedingRecord: (id: string) => Promise.resolve(false),
    addFinanceRecord: (record: any) => Promise.resolve(null),
    updateFinanceRecord: (id: string, updates: any) => Promise.resolve(null),
    deleteFinanceRecord: (id: string) => Promise.resolve(false),
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
