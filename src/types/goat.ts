
import { MediaFile } from './media';

export interface Goat {
  id: string;
  name: string;
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  color: string;
  status: 'active' | 'sold' | 'deceased';
  hornStatus: 'horned' | 'polled' | 'disbudded';
  fatherId?: string;
  motherId?: string;
  photoPath?: string; // Legacy field - keep for backward compatibility
  imageId?: string; // Legacy field - keep for backward compatibility
  mediaFiles: MediaFile[]; // New enhanced media system
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightRecord {
  id: string;
  goatId: string;
  date: Date;
  weight: number; // in kg
  notes?: string;
}

export interface HealthRecord {
  id: string;
  goatId: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup' | 'deworming' | 'other';
  description: string;
  medicine?: string;
  veterinarian?: string;
  status?: 'scheduled' | 'completed' | 'overdue';
  nextDueDate?: Date;
  notes?: string;
}

export interface BreedingRecord {
  id: string;
  sireId: string;
  damId: string;
  breedingDate: Date;
  expectedDueDate?: Date;
  actualBirthDate?: Date;
  kidIds: string[];
  notes?: string;
}

export interface FarmStats {
  totalGoats: number;
  activeGoats: number;
  maleGoats: number;
  femaleGoats: number;
  kidsBornThisYear: number;
  upcomingHealthReminders: number;
  averageWeight: number;
  breedDistribution: Record<string, number>;
}

// Feed management types
export interface Feed {
  id: string;
  name: string;
  type: 'hay' | 'grain' | 'supplement' | 'pellet' | 'mineral' | 'other';
  costPerKg: number;
  stockKg: number;
  expiryDate?: Date;
  supplier: string;
  nutritionalInfo?: {
    protein: number;
    fiber: number;
    energy: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPlanItem {
  feedId: string;
  amountPerDay: number; // in kg
  frequency: number; // times per day
}

export interface FeedPlan {
  id: string;
  name: string;
  groupType: 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant';
  feedItems: FeedPlanItem[];
  totalCostPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedLog {
  id: string;
  goatId: string;
  feedId: string;
  date: Date;
  amountUsed: number;
  cost: number;
  notes?: string;
  createdAt: Date;
}

export interface FeedStats {
  totalFeedCost: number;
  dailyFeedCost: number;
  feedEfficiency: number;
  lowStockFeeds: Feed[];
  expiringFeeds: Feed[];
  monthlyCostTrends: Array<{ month: string; cost: number }>;
}

// Add new interfaces for growth optimization
export interface BreedStandard {
  id: string;
  breedName: string;
  milestones: Array<{
    ageMonths: number;
    expectedWeight: number; // in kg
    minWeight: number;
    maxWeight: number;
  }>;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrowthPerformance {
  goatId: string;
  currentScore: number; // GPS (Growth Performance Score)
  trend: 'improving' | 'stable' | 'declining';
  status: 'above-standard' | 'on-track' | 'below-standard' | 'concerning';
  lastCalculated: Date;
  recommendations: string[];
}

export interface GrowthAnalytics {
  averageHerdGPS: number;
  topPerformers: Array<{ goatId: string; score: number }>;
  underPerformers: Array<{ goatId: string; score: number }>;
  growthTrends: Array<{ month: string; averageGPS: number }>;
  breedComparison: Record<string, number>;
}
