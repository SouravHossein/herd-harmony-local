
import React, { createContext, useContext, ReactNode } from 'react';
import { useGoatData } from '@/hooks/useDatabase';
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
  // Only use Electron backend - no localStorage fallback
  if (!window.electronAPI?.isElectron) {
    throw new Error('This application requires Electron environment. Please run the desktop application.');
  }
  
  const electronData = useGoatData();
  
  // Utility functions that work with Electron data
  const getGoatWeightHistory = (goatId: string): WeightRecord[] => {
    return (electronData.weightRecords || []).filter((record: WeightRecord) => record.goatId === goatId);
  };

  const getGoatHealthHistory = (goatId: string): HealthRecord[] => {
    return (electronData.healthRecords || []).filter((record: HealthRecord) => record.goatId === goatId);
  };

  const getUpcomingHealthReminders = (): HealthRecord[] => {
    const records = electronData.healthRecords || [];
    const now = new Date();
    return records.filter((record: HealthRecord) => 
      record.status === 'scheduled' && 
      record.nextDueDate && 
      new Date(record.nextDueDate) >= now
    );
  };

  const exportData = async () => {
    return electronData.exportData();
  };

  const importData = async (data: any) => {
    return electronData.importData(data);
  };

  const clearAllData = async () => {
    return electronData.clearAll();
  };

  const getFarmStats = () => {
    const goats = electronData.goats || [];
    const weightRecords = electronData.weightRecords || [];
    const healthRecords = electronData.healthRecords || [];

    return {
      totalGoats: goats.length,
      activeGoats: goats.filter((g: Goat) => g.status === 'active').length,
      averageWeight: weightRecords.length > 0 
        ? weightRecords.reduce((sum: number, r: WeightRecord) => sum + r.weight, 0) / weightRecords.length 
        : 0,
      upcomingReminders: getUpcomingHealthReminders().length
    };
  };
  
  // Production-ready context value using only Electron backend
  const contextValue: GoatContextType = {
    goats: electronData.goats || [],
    setGoats: () => {
      console.warn('Direct setGoats not supported in Electron mode. Use addGoat, updateGoat, deleteGoat instead.');
    },
    weightRecords: electronData.weightRecords || [],
    setWeightRecords: () => {
      console.warn('Direct setWeightRecords not supported in Electron mode. Use addWeightRecord, updateWeightRecord, deleteWeightRecord instead.');
    },
    healthRecords: electronData.healthRecords || [],
    setHealthRecords: () => {
      console.warn('Direct setHealthRecords not supported in Electron mode. Use addHealthRecord, updateHealthRecord, deleteHealthRecord instead.');
    },
    breedingRecords: electronData.breedingRecords || [],
    setBreedingRecords: () => {
      console.warn('Direct setBreedingRecords not supported in Electron mode. Use addBreedingRecord, updateBreedingRecord, deleteBreedingRecord instead.');
    },
    financeRecords: electronData.financeRecords || [],
    setFinanceRecords: () => {
      console.warn('Direct setFinanceRecords not supported in Electron mode. Use addFinanceRecord, updateFinanceRecord, deleteFinanceRecord instead.');
    },
    feeds: electronData.feeds || [],
    setFeeds: () => {
      console.warn('Direct setFeeds not supported in Electron mode. Use feed management methods instead.');
    },
    feedPlans: electronData.feedPlans || [],
    setFeedPlans: () => {
      console.warn('Direct setFeedPlans not supported in Electron mode. Use feed plan management methods instead.');
    },
    feedLogs: electronData.feedLogs || [],
    setFeedLogs: () => {
      console.warn('Direct setFeedLogs not supported in Electron mode. Use addFeedLog instead.');
    },
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
