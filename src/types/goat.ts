
export interface Goat {
  id: string;
  name: string;
  // nickname?: string;
  tagNumber: string;
  breed: string;
  birthDate: Date;
  birthWeight?: number;
  gender: 'male' | 'female';
  castrated?: boolean;
  status: 'active' | 'sold' | 'deceased' | 'archived';
  breedingStatus: '' | 'pregnant' | 'lactating' | 'resting' | 'kid' | 'active';
  fatherId?: string;
  motherId?: string;
  color?: string;
  hornStatus?: 'horned' | 'polled' | 'disbudded';
  currentWeight?: number;
  isFavorite?: boolean;
  notes?: string;
  tags?: string[];
  imageId?: string; // For image storage
  photoPath?: string; // Legacy support
  acquisitionType?: 'born' | 'bought' | 'gifted' | 'rented';
  farmId?: string;
  partition?: string;
  // Genetic traits for pedigree
  genetics?: {
    coatColor: string;
    hornStatus: 'horned' | 'polled' | 'disbudded';
    fertilityScore: number;
    milkYieldGenetics?: number;
    hornGenotype?: 'PP' | 'Ph' | 'hh';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightRecord {
  id: string;
  goatId: string;
  weight: number;
  date: Date;
  method: 'actual' | 'estimated';
  chestGirth?: number;
  bodyLength?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthRecord {
  id: string;
  goatId: string;
  type: 'vaccination' | 'treatment' | 'checkup' | 'medication' | 'injury' | 'illness' | 'deworming';
  description: string;
  date: Date;
  nextDueDate?: Date;
  cost?: number;
  veterinarian?: string;
  medications?: string;
  medicine?: string; // Alias for medications
  notes?: string;
  status: 'completed' | 'scheduled' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface BreedingRecord {
  id: string;
  doeId: string;
  damId: string; // Alias for doeId  
  buckId: string;
  sireId: string; // Alias for buckId
  breedingDate: Date;
  method: 'natural' | 'artificial';
  expectedKiddingDate?: Date;
  expectedDueDate?: Date; // Alias for expectedKiddingDate
  actualKiddingDate?: Date;
  actualBirthDate?: Date; // Alias for actualKiddingDate
  numberOfKids?: number;
  kidIds?: string[];
  notes?: string;
  status: 'planned' | 'confirmed' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// src/types/goat.ts
export type MediaKind = 'image' | 'video' | 'document';

export interface MediaFile {
  id: string;
  type: MediaKind;
  goatId: string;
  // NOTE: stored in DB as relative path like "goatId/filename.mp4"
  url: string;            // when read by renderer via IPC this will be app://<relativePath> (string)
  thumbnailUrl?: string;  // when returned by IPC this will be a data URL (string) or null
  primary: boolean;
  filename: string;
  uploadDate: string | Date;
  timestamp: string | Date;
  category?: 'birth' | 'health' | 'growth' | 'breeding' | 'general' | 'milestone' | 'weaning';
  tags?: string[];
  description?: string;
  size?: number;    // bytes
  createdAt: string | Date;
}

export interface MediaUploadFile {
  name: string;
  type?: string;
  data?: string; // optional dataURL for small files (not used in chunked flow)
}



export interface Feed {
  id: string;
  name: string;
  type: 'grass' | 'hay' | 'grain' | 'pellets' | 'supplement' | 'mineral' | 'other';
  brand?: string;
  protein?: number;
  fiber?: number;
  cost?: number;
  costPerKg?: number;
  stockKg?: number;
  expiryDate?: Date;
  unit?: string;
  supplier?: string;
  notes?: string;
  nutritionalInfo?: {
    protein: number;
    fiber: number;
    fat: number;
    calcium: number;
    phosphorus: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPlan {
  id: string;
  name: string;
  description?: string;
  goatIds: string[];
  feeds: FeedPlanItem[];
  feedItems?: FeedPlanItem[]; // Alias for feeds
  groupType?: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  totalCostPerDay?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPlanItem {
  feedId: string;
  amount: number;
  amountPerDay?: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  timesPerDay?: number;
}
export interface Farm {
  id: string;
  name: string;
  location: string;
  partitions: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface KnownFarmer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedLog {
  id: string;
  goatId: string;
  feedId: string;
  amountUsed?: number; 
  unit: string;
  date: Date;
  cost?: number;
  notes?: string;
  createdAt: Date;
}

// Growth and breeding types for pedigree system
export interface BreedStandard {
  id: string;
  breedName: string;
  milestones: {
    ageMonths: number;
    expectedWeight: number;
    minWeight: number;
    maxWeight: number;
  }[];
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrowthPerformance {
  goatId: string;
  currentScore: number;
  trend: 'improving' | 'stable' | 'declining';
  status: 'above-standard' | 'on-track' | 'below-standard' | 'concerning';
  lastCalculated: Date;
  recommendations: string[];
}

export interface GrowthAnalytics {
  averageHerdGPS: number;
  topPerformers: { goatId: string; score: number }[];
  underPerformers: { goatId: string; score: number }[];
  growthTrends: { month: string; averageGPS: number }[];
  breedComparison: Record<string, number>;
}


