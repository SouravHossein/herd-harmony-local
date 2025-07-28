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

// Fallback to localStorage if not in Electron
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

export function useDatabase<T>(tableName: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isElectron = window.electronAPI?.isElectron;

  useEffect(() => {
    loadData();
  }, [tableName]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isElectron) {
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
          default:
            result = initialValue;
        }
        setData(result as T);
      } else {
        // Fallback to localStorage
        const result = getLocalStorageItem(tableName, initialValue);
        setData(result);
      }
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      setError(`Failed to load ${tableName}`);
      setData(initialValue);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (newData: T | ((prevData: T) => T)) => {
    try {
      const valueToStore = typeof newData === 'function' ? (newData as Function)(data) : newData;
      
      if (isElectron) {
        // In Electron, we don't directly update the entire dataset
        // Individual operations are handled by specific methods
        setData(valueToStore);
      } else {
        // Fallback to localStorage
        setLocalStorageItem(tableName, valueToStore);
        setData(valueToStore);
      }
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      setError(`Failed to update ${tableName}`);
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

  // Electron-specific operations
  const electronOperations = {
    // Goat operations
    addGoat: async (goat: any) => {
      if (window.electronAPI?.isElectron) {
        const newGoat = await window.electronAPI.addGoat(goat);
        goats.reload();
        return newGoat;
      }
      return null;
    },
    
    updateGoat: async (id: string, updates: any) => {
      if (window.electronAPI?.isElectron) {
        const updatedGoat = await window.electronAPI.updateGoat(id, updates);
        goats.reload();
        return updatedGoat;
      }
      return null;
    },
    
    deleteGoat: async (id: string) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.deleteGoat(id);
        if (success) {
          goats.reload();
          weightRecords.reload();
          healthRecords.reload();
        }
        return success;
      }
      return false;
    },

    // Weight record operations
    addWeightRecord: async (record: any) => {
      if (window.electronAPI?.isElectron) {
        const newRecord = await window.electronAPI.addWeightRecord(record);
        weightRecords.reload();
        return newRecord;
      }
      return null;
    },

    updateWeightRecord: async (id: string, updates: any) => {
      if (window.electronAPI?.isElectron) {
        const updatedRecord = await window.electronAPI.updateWeightRecord(id, updates);
        weightRecords.reload();
        return updatedRecord;
      }
      return null;
    },

    deleteWeightRecord: async (id: string) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.deleteWeightRecord(id);
        if (success) {
          weightRecords.reload();
        }
        return success;
      }
      return false;
    },

    // Health record operations
    addHealthRecord: async (record: any) => {
      if (window.electronAPI?.isElectron) {
        const newRecord = await window.electronAPI.addHealthRecord(record);
        healthRecords.reload();
        return newRecord;
      }
      return null;
    },

    updateHealthRecord: async (id: string, updates: any) => {
      if (window.electronAPI?.isElectron) {
        const updatedRecord = await window.electronAPI.updateHealthRecord(id, updates);
        healthRecords.reload();
        return updatedRecord;
      }
      return null;
    },

    deleteHealthRecord: async (id: string) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.deleteHealthRecord(id);
        if (success) {
          healthRecords.reload();
        }
        return success;
      }
      return false;
    },

    // Breeding record operations
    addBreedingRecord: async (record: any) => {
      if (window.electronAPI?.isElectron) {
        const newRecord = await window.electronAPI.addBreedingRecord(record);
        breedingRecords.reload();
        return newRecord;
      }
      return null;
    },

    updateBreedingRecord: async (id: string, updates: any) => {
      if (window.electronAPI?.isElectron) {
        const updatedRecord = await window.electronAPI.updateBreedingRecord(id, updates);
        breedingRecords.reload();
        return updatedRecord;
      }
      return null;
    },

    deleteBreedingRecord: async (id: string) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.deleteBreedingRecord(id);
        if (success) {
          breedingRecords.reload();
        }
        return success;
      }
      return false;
    },

    // Pedigree operations
    getPedigreeTree: async (goatId: string, generations: number) => {
      if (window.electronAPI?.isElectron) {
        return await window.electronAPI.getPedigreeTree(goatId, generations);
      }
      return null;
    },

    calculateInbreedingRisk: async (sireId: string, damId: string) => {
      if (window.electronAPI?.isElectron) {
        return await window.electronAPI.calculateInbreedingRisk(sireId, damId);
      }
      return null;
    },

    // Data management
    exportData: async () => {
      if (window.electronAPI?.isElectron) {
        return await window.electronAPI.exportData();
      }
      return null;
    },

    importData: async (data: any) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.importData(data);
        if (success) {
          goats.reload();
          weightRecords.reload();
          healthRecords.reload();
          breedingRecords.reload();
        }
        return success;
      }
      return false;
    },

    clearAll: async () => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.clearAll();
        if (success) {
          goats.reload();
          weightRecords.reload();
          healthRecords.reload();
          breedingRecords.reload();
        }
        return success;
      }
      return false;
    },

    // Finance record operations
    addFinanceRecord: async (record: any) => {
      if (window.electronAPI?.isElectron) {
        const newRecord = await window.electronAPI.addFinanceRecord(record);
        financeRecords.reload();
        return newRecord;
      }
      return null;
    },

    updateFinanceRecord: async (id: string, updates: any) => {
      if (window.electronAPI?.isElectron) {
        const updatedRecord = await window.electronAPI.updateFinanceRecord(id, updates);
        financeRecords.reload();
        return updatedRecord;
      }
      return null;
    },

    deleteFinanceRecord: async (id: string) => {
      if (window.electronAPI?.isElectron) {
        const success = await window.electronAPI.deleteFinanceRecord(id);
        if (success) {
          financeRecords.reload();
        }
        return success;
      }
      return false;
    },
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
    loading: goats.loading || weightRecords.loading || healthRecords.loading || breedingRecords.loading || financeRecords.loading,
    ...electronOperations
  };
}
