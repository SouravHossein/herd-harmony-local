/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode } from 'react';
import { useGoatData } from '@/hooks/useDatabase';
import { Goat, WeightRecord, HealthRecord, BreedingRecord, Feed, FeedPlan, FeedLog, MediaFile, MediaUploadFile } from '@/types/goat';

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
  addFeed: (feed: any) => Promise<any>;
  updateFeed: (id: string, updates: any) => Promise<any>;
  deleteFeed: (id: string) => Promise<boolean>;
  addFeedPlan: (plan: any) => Promise<any>;
  updateFeedPlan: (id: string, updates: any) => Promise<any>;
  deleteFeedPlan: (id: string) => Promise<boolean>;
  addFeedLog: (log: any) => Promise<any>;
  updateFeedLog: (id: string, updates: any) => Promise<any>;
  deleteFeedLog: (id: string) => Promise<boolean>;
  getGoatWeightHistory: (goatId: string) => WeightRecord[];
  getGoatHealthHistory: (goatId: string) => HealthRecord[];
  getUpcomingHealthReminders: () => HealthRecord[];


  // Media operations
  getMediaByGoatId: (goatId: string) => Promise<MediaFile[]>;
  getThumbnails: () => Promise<{ goatId: string; thumbnailUrl: string | null }[]>;
  addMediaViaDialog: (goatId: string, category: string, description?: string, tags?: string[]) => Promise<MediaFile[]>;
  uploadStart: (meta: { goatId: string; filename: string; totalSize: number; category: string; description?: string; tags?: string[] }) => Promise<{ uploadId: string }>;
  uploadChunk: (uploadId: string, chunk: ArrayBuffer) => Promise<boolean>;
  uploadComplete: (uploadId: string) => Promise<MediaFile | null>;
  updateMedia: (mediaId: string, updates: Partial<MediaFile>) => Promise<MediaFile | null>;
  deleteMedia: (mediaId: string) => Promise<boolean>;
  downloadMedia: (mediaId: string) => Promise<{ success: boolean; error?: string }>;
  setPrimaryMedia: (goatId: string, mediaId: string) => Promise<MediaFile | null>;

  // // File operations for UI
  // getMediaFilePath: (mediaId: string) => Promise<string | null>;
  // openMediaFile: (mediaId: string) => Promise<boolean>;
  // revealMediaFileInFolder: (mediaId: string) => Promise<boolean>;


  // File operations
  // showSaveDialog: (options: any) => Promise<any>;
  // showOpenDialog: (options: any) => Promise<any>;
  // writeFile: (filePath: string, data: string) => Promise<boolean>;
  // readFile: (filePath: string) => Promise<string | null>;
  // deleteFile: (filePath: string) => Promise<boolean>;
  // Data import/export
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  getFarmStats: () => any;
  getPedigreeTree: (goatId: string, generations?: number) => Promise<any>;
  calculateInbreedingRisk: (sireId: string, damId: string) => Promise<any>;
}

const GoatContext = createContext<GoatContextType | undefined>(undefined);

export function GoatProvider({ children }: { children: ReactNode }) {
  // Check if running in Electron environment
  const isElectron = window.electronAPI?.isElectron;

  // Use appropriate data layer based on environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const electronData = isElectron ? useGoatData() : null;
  // const localStorageData = !isElectron ? useLocalStorageData() : null;

  // Use Electron data if available, otherwise localStorage
  const currentData = electronData //|| localStorageData!;

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

  // Pedigree functions for both Electron and browser environments
  const getPedigreeTree = async (goatId: string, generations = 3) => {
    if (isElectron && electronData) {
      return electronData.getPedigreeTree(goatId, generations);
    }

    // Browser fallback - build pedigree from local data
    const goats = currentData.goats || [];
    const nodes: any[] = [];
    const edges: any[] = [];
    const processedIds = new Set<string>();

    const addNode = (goat: Goat | null, x: number, y: number, generation: number) => {
      const nodeId = goat?.id || `unknown-${Math.random()}`;
      if (goat && processedIds.has(goat.id)) return nodeId;
      if (goat) processedIds.add(goat.id);

      const father = goat?.fatherId ? goats.find(g => g.id === goat.fatherId) : null;
      const fatherImageUrl = father?.mediaFiles?.find(m => m.type === 'image')?.url || null;

      nodes.push({
        id: nodeId,
        type: 'pedigree',
        position: { x, y },
        data: {
          goat,
          generation,
          fatherImageUrl,
          fatherInfo: father ? {
            name: father.name,
            tagNumber: father.tagNumber,
            breed: father.breed
          } : null
        }
      });

      return nodeId;
    };

    const buildMaternalTree = (currentGoatId: string, generation: number, x: number, y: number): string | null => {
      if (generation > generations) return null;
      const goat = goats.find(g => g.id === currentGoatId);
      if (!goat) return null;

      const nodeId = addNode(goat, x, y, generation);

      if (goat.motherId && generation < generations) {
        const motherX = x - 250;
        const motherY = y;
        const motherNodeId = buildMaternalTree(goat.motherId, generation + 1, motherX, motherY);

        if (motherNodeId) {
          edges.push({
            id: `${goat.motherId}-${currentGoatId}`,
            source: goat.motherId,
            target: currentGoatId,
            type: 'smoothstep',
            style: { stroke: '#3B82F6', strokeWidth: 2 }
          });
        }
      }

      return nodeId;
    };

    buildMaternalTree(goatId, 0, 400, 200);

    return { nodes, edges };
  };

  const calculateInbreedingRisk = async (sireId: string, damId: string) => {
    if (isElectron && electronData) {
      return electronData.calculateInbreedingRisk(sireId, damId);
    }

    // Browser fallback - simple calculation
    return {
      risk: 0,
      coefficient: 0,
      commonAncestors: [],
      riskLevel: 'low'
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
    addFeed: currentData.addFeed,
    updateFeed: currentData.updateFeed,
    deleteFeed: currentData.deleteFeed,
    addFeedPlan: currentData.addFeedPlan,
    updateFeedPlan: currentData.updateFeedPlan,
    deleteFeedPlan: currentData.deleteFeedPlan,
    addFeedLog: currentData.addFeedLog,
    updateFeedLog: currentData.updateFeedLog,
    deleteFeedLog: currentData.deleteFeedLog,
    getGoatWeightHistory,
    getGoatHealthHistory,
    getUpcomingHealthReminders,
    exportData,
    importData,
    clearAllData,
    getFarmStats,
    getPedigreeTree,
    calculateInbreedingRisk,
    // Media operations
    getThumbnails: currentData.getThumbnails,
    getMediaByGoatId: currentData.getMediaByGoatId,
    addMediaViaDialog: currentData.addMediaViaDialog,
    uploadStart: currentData.uploadStart,
    uploadChunk: currentData.uploadChunk,
    uploadComplete: currentData.uploadComplete,
    updateMedia: currentData.updateMedia,
    deleteMedia: currentData.deleteMedia,
    downloadMedia: currentData.downloadMedia,
    setPrimaryMedia: currentData.setPrimaryMedia,
    // File operations for UI
    // getMediaFilePath: currentData.getMediaFilePath,    
    // openMediaFile: currentData.openMediaFile,
    // revealMediaFileInFolder: currentData.revealMediaFileInFolder,
    // // File operations
    // showSaveDialog: currentData.showSaveDialog,
    // showOpenDialog: currentData.showOpenDialog,
    // writeFile: currentData.writeFile,
    // readFile: currentData.readFile,
    // deleteFile: currentData.deleteFile, 
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
