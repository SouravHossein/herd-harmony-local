
export interface Goat {
  id: string;
  name: string;
  tagNumber: string;
  breed: string;
  birthDate: Date;
  gender: 'male' | 'female';
  status: 'active' | 'sold' | 'deceased';
  breedingStatus: '' | 'pregnant' | 'lactating' | 'resting'| 'kid';
  fatherId?: string;
  motherId?: string;
  color?: string;
  currentWeight?: number;
  acquisitionType?: 'born' | 'bought';
  isFavorite?: boolean;
  notes?: string;
  mediaFiles?: MediaFile[];
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
  type: 'vaccination' | 'treatment' | 'checkup' | 'medication' | 'injury' | 'illness';
  description: string;
  date: Date;
  nextDueDate?: Date;
  cost?: number;
  veterinarian?: string;
  medications?: string;
  notes?: string;
  status: 'completed' | 'scheduled' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface BreedingRecord {
  id: string;
  doeId: string;
  buckId: string;
  breedingDate: Date;
  method: 'natural' | 'artificial';
  expectedKiddingDate?: Date;
  actualKiddingDate?: Date;
  numberOfKids?: number;
  kidIds?: string[];
  notes?: string;
  status: 'planned' | 'confirmed' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  filename: string;
  uploadDate: Date;
  description?: string;
  size?: number;
}

export interface Feed {
  id: string;
  name: string;
  type: 'hay' | 'grain' | 'pellets' | 'supplement' | 'mineral' | 'other';
  brand?: string;
  protein?: number;
  fiber?: number;
  cost?: number;
  unit?: string;
  supplier?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPlan {
  id: string;
  name: string;
  description?: string;
  goatIds: string[];
  feeds: FeedPlanItem[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPlanItem {
  feedId: string;
  amount: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  timesPerDay?: number;
}

export interface FeedLog {
  id: string;
  goatId: string;
  feedId: string;
  amount: number;
  unit: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}
