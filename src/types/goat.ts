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
  veterinarian?: string;
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