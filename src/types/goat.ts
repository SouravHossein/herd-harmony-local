
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
  photoPath?: string;
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

export interface FeedPlan {
  id: string;
  name: string;
  groupType: 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant';
  feedItems: Array<{
    feedId: string;
    amountPerDay: number; // in kg
    frequency: number; // times per day
  }>;
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
