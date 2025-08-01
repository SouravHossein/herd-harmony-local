
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      // Goat operations
      getGoats: () => Promise<any[]>;
      addGoat: (goat: any) => Promise<any>;
      updateGoat: (id: string, updates: any) => Promise<any>;
      deleteGoat: (id: string) => Promise<boolean>;
      
      // Weight records
      getWeightRecords: () => Promise<any[]>;
      addWeightRecord: (record: any) => Promise<any>;
      updateWeightRecord: (id: string, updates: any) => Promise<any>;
      deleteWeightRecord: (id: string) => Promise<boolean>;
      
      // Health records
      getHealthRecords: () => Promise<any[]>;
      addHealthRecord: (record: any) => Promise<any>;
      updateHealthRecord: (id: string, updates: any) => Promise<any>;
      deleteHealthRecord: (id: string) => Promise<boolean>;
      
      // Breeding records
      getBreedingRecords: () => Promise<any[]>;
      addBreedingRecord: (record: any) => Promise<any>;
      updateBreedingRecord: (id: string, updates: any) => Promise<any>;
      deleteBreedingRecord: (id: string) => Promise<boolean>;

      // Finance records
      getFinanceRecords: () => Promise<any[]>;
      addFinanceRecord: (record: any) => Promise<any>;
      updateFinanceRecord: (id: string, updates: any) => Promise<any>;
      deleteFinanceRecord: (id: string) => Promise<boolean>;

      // Feed operations
      getFeeds: () => Promise<any[]>;
      addFeed: (feed: any) => Promise<any>;
      updateFeed: (id: string, updates: any) => Promise<any>;
      deleteFeed: (id: string) => Promise<boolean>;

      // Feed plan operations
      getFeedPlans: () => Promise<any[]>;
      addFeedPlan: (plan: any) => Promise<any>;
      updateFeedPlan: (id: string, updates: any) => Promise<any>;
      deleteFeedPlan: (id: string) => Promise<boolean>;

      // Feed log operations
      getFeedLogs: () => Promise<any[]>;
      addFeedLog: (log: any) => Promise<any>;
      
      // Data management
      exportData: () => Promise<any>;
      importData: (data: any) => Promise<boolean>;
      clearAll: () => Promise<boolean>;

      // Pedigree operations
      getPedigreeTree: (goatId: string, generations: number) => Promise<any>;
      calculateInbreedingRisk: (sireId: string, damId: string) => Promise<any>;
      
      // File operations
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      writeFile: (filePath: string, data: string) => Promise<boolean>;
      readFile: (filePath: string) => Promise<string | null>;
      
      // Backup operations
      createBackup: (password: string) => Promise<{ success: boolean; filename?: string; error?: string }>;
      restoreBackup: (backupId: string, password: string) => Promise<{ success: boolean; error?: string }>;
      getBackupFiles: () => Promise<any[]>;
      deleteBackup: (backupId: string) => Promise<boolean>;
      getBackupSettings: () => Promise<any>;
      saveBackupSettings: (settings: any) => Promise<boolean>;
      selectBackupPath: () => Promise<{ path?: string; canceled?: boolean }>;
      
      isElectron: boolean;
    };
  }
}

export function useDatabase<T>(tableName: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure Electron environment
  if (!window.electronAPI?.isElectron) {
    throw new Error('This application requires Electron environment. Please run the desktop application.');
  }

  useEffect(() => {
    loadData();
  }, [tableName]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (tableName) {
        case 'goats':
          result = await window.electronAPI!.getGoats();
          break;
        case 'weightRecords':
          result = await window.electronAPI!.getWeightRecords();
          break;
        case 'healthRecords':
          result = await window.electronAPI!.getHealthRecords();
          break;
        case 'breedingRecords':
          result = await window.electronAPI!.getBreedingRecords();
          break;
        case 'financeRecords':
          result = await window.electronAPI!.getFinanceRecords();
          break;
        case 'feeds':
          result = await window.electronAPI!.getFeeds();
          break;
        case 'feedPlans':
          result = await window.electronAPI!.getFeedPlans();
          break;
        case 'feedLogs':
          result = await window.electronAPI!.getFeedLogs();
          break;
        default:
          result = initialValue;
      }
      setData(result as T);
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      setError(`Failed to load ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setData(initialValue);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (newData: T | ((prevData: T) => T)) => {
    try {
      const valueToStore = typeof newData === 'function' ? (newData as Function)(data) : newData;
      setData(valueToStore);
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      setError(`Failed to update ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    data,
    setData: updateData,
    loading,
    error,
    reload: loadData
  };
}

export function useGoatData() {
  const goats = useDatabase('goats', []);
  const weightRecords = useDatabase('weightRecords', []);
  const healthRecords = useDatabase('healthRecords', []);
  const breedingRecords = useDatabase('breedingRecords', []);
  const financeRecords = useDatabase('financeRecords', []);
  const feeds = useDatabase('feeds', []);
  const feedPlans = useDatabase('feedPlans', []);
  const feedLogs = useDatabase('feedLogs', []);

  // Production-ready Electron operations
  const electronOperations = {
    // Goat operations
    addGoat: async (goat: any) => {
      const newGoat = await window.electronAPI!.addGoat(goat);
      await goats.reload();
      return newGoat;
    },
    
    updateGoat: async (id: string, updates: any) => {
      const updatedGoat = await window.electronAPI!.updateGoat(id, updates);
      await goats.reload();
      return updatedGoat;
    },
    
    deleteGoat: async (id: string) => {
      const success = await window.electronAPI!.deleteGoat(id);
      if (success) {
        await Promise.all([
          goats.reload(),
          weightRecords.reload(),
          healthRecords.reload()
        ]);
      }
      return success;
    },

    // Weight record operations
    addWeightRecord: async (record: any) => {
      const newRecord = await window.electronAPI!.addWeightRecord(record);
      await weightRecords.reload();
      return newRecord;
    },

    updateWeightRecord: async (id: string, updates: any) => {
      const updatedRecord = await window.electronAPI!.updateWeightRecord(id, updates);
      await weightRecords.reload();
      return updatedRecord;
    },

    deleteWeightRecord: async (id: string) => {
      const success = await window.electronAPI!.deleteWeightRecord(id);
      if (success) {
        await weightRecords.reload();
      }
      return success;
    },

    // Health record operations
    addHealthRecord: async (record: any) => {
      const newRecord = await window.electronAPI!.addHealthRecord(record);
      await healthRecords.reload();
      return newRecord;
    },

    updateHealthRecord: async (id: string, updates: any) => {
      const updatedRecord = await window.electronAPI!.updateHealthRecord(id, updates);
      await healthRecords.reload();
      return updatedRecord;
    },

    deleteHealthRecord: async (id: string) => {
      const success = await window.electronAPI!.deleteHealthRecord(id);
      if (success) {
        await healthRecords.reload();
      }
      return success;
    },

    // Breeding record operations
    addBreedingRecord: async (record: any) => {
      const newRecord = await window.electronAPI!.addBreedingRecord(record);
      await breedingRecords.reload();
      return newRecord;
    },

    updateBreedingRecord: async (id: string, updates: any) => {
      const updatedRecord = await window.electronAPI!.updateBreedingRecord(id, updates);
      await breedingRecords.reload();
      return updatedRecord;
    },

    deleteBreedingRecord: async (id: string) => {
      const success = await window.electronAPI!.deleteBreedingRecord(id);
      if (success) {
        await breedingRecords.reload();
      }
      return success;
    },

    // Finance record operations
    addFinanceRecord: async (record: any) => {
      const newRecord = await window.electronAPI!.addFinanceRecord(record);
      await financeRecords.reload();
      return newRecord;
    },

    updateFinanceRecord: async (id: string, updates: any) => {
      const updatedRecord = await window.electronAPI!.updateFinanceRecord(id, updates);
      await financeRecords.reload();
      return updatedRecord;
    },

    deleteFinanceRecord: async (id: string) => {
      const success = await window.electronAPI!.deleteFinanceRecord(id);
      if (success) {
        await financeRecords.reload();
      }
      return success;
    },

    // Feed operations
    addFeed: async (feed: any) => {
      const newFeed = await window.electronAPI!.addFeed(feed);
      await feeds.reload();
      return newFeed;
    },

    updateFeed: async (id: string, updates: any) => {
      const updatedFeed = await window.electronAPI!.updateFeed(id, updates);
      await feeds.reload();
      return updatedFeed;
    },

    deleteFeed: async (id: string) => {
      const success = await window.electronAPI!.deleteFeed(id);
      if (success) {
        await feeds.reload();
      }
      return success;
    },

    // Feed plan operations
    addFeedPlan: async (plan: any) => {
      const newPlan = await window.electronAPI!.addFeedPlan(plan);
      await feedPlans.reload();
      return newPlan;
    },

    updateFeedPlan: async (id: string, updates: any) => {
      const updatedPlan = await window.electronAPI!.updateFeedPlan(id, updates);
      await feedPlans.reload();
      return updatedPlan;
    },

    deleteFeedPlan: async (id: string) => {
      const success = await window.electronAPI!.deleteFeedPlan(id);
      if (success) {
        await feedPlans.reload();
      }
      return success;
    },

    // Feed log operations
    addFeedLog: async (log: any) => {
      const newLog = await window.electronAPI!.addFeedLog(log);
      await feedLogs.reload();
      return newLog;
    },

    // Pedigree operations
    getPedigreeTree: async (goatId: string, generations: number) => {
      return await window.electronAPI!.getPedigreeTree(goatId, generations);
    },

    calculateInbreedingRisk: async (sireId: string, damId: string) => {
      return await window.electronAPI!.calculateInbreedingRisk(sireId, damId);
    },

    // Data management
    exportData: async () => {
      return await window.electronAPI!.exportData();
    },

    importData: async (data: any) => {
      const success = await window.electronAPI!.importData(data);
      if (success) {
        await Promise.all([
          goats.reload(),
          weightRecords.reload(),
          healthRecords.reload(),
          breedingRecords.reload(),
          financeRecords.reload(),
          feeds.reload(),
          feedPlans.reload(),
          feedLogs.reload()
        ]);
      }
      return success;
    },

    clearAll: async () => {
      const success = await window.electronAPI!.clearAll();
      if (success) {
        await Promise.all([
          goats.reload(),
          weightRecords.reload(),
          healthRecords.reload(),
          breedingRecords.reload(),
          financeRecords.reload(),
          feeds.reload(),
          feedPlans.reload(),
          feedLogs.reload()
        ]);
      }
      return success;
    }
  };

  return {
    goats: goats.data,
    setGoats: goats.setData,
    weightRecords: weightRecords.data,
    setWeightRecords: weightRecords.setData,
    healthRecords: healthRecords.data,
    setHealthRecords: healthRecords.setData,
    breedingRecords: breedingRecords.data,
    setBreedingRecords: breedingRecords.setData,
    financeRecords: financeRecords.data,
    setFinanceRecords: financeRecords.setData,
    feeds: feeds.data,
    setFeeds: feeds.setData,
    feedPlans: feedPlans.data,
    setFeedPlans: feedPlans.setData,
    feedLogs: feedLogs.data,
    setFeedLogs: feedLogs.setData,
    loading: goats.loading || weightRecords.loading || healthRecords.loading || breedingRecords.loading || financeRecords.loading || feeds.loading || feedPlans.loading || feedLogs.loading,
    error: goats.error || weightRecords.error || healthRecords.error || breedingRecords.error || financeRecords.error || feeds.error || feedPlans.error || feedLogs.error,
    ...electronOperations
  };
}
