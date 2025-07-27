import { Goat, WeightRecord, HealthRecord } from '@/types/goat';

export const sampleGoats: Goat[] = [
  {
    id: 'goat-1',
    name: 'Bella',
    breed: 'Nubian',
    tagNumber: 'N001',
    gender: 'female',
    dateOfBirth: new Date('2022-03-15'),
    color: 'brown and white',
    status: 'active',
    hornStatus: 'disbudded',
    notes: 'Great milker, very friendly',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'goat-2',
    name: 'Max',
    breed: 'Boer',
    tagNumber: 'B001',
    gender: 'male',
    dateOfBirth: new Date('2021-12-10'),
    color: 'white with red head',
    status: 'active',
    hornStatus: 'horned',
    notes: 'Breeding buck, excellent genetics',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'goat-3',
    name: 'Luna',
    breed: 'Alpine',
    tagNumber: 'A001',
    gender: 'female',
    dateOfBirth: new Date('2023-05-22'),
    color: 'black and tan',
    status: 'active',
    hornStatus: 'disbudded',
    notes: 'First-time mother, doing well',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const sampleWeightRecords: WeightRecord[] = [
  // Bella's weight records
  {
    id: 'weight-1',
    goatId: 'goat-1',
    date: new Date('2024-01-15'),
    weight: 65.5,
    notes: 'Initial weight when acquired',
  },
  {
    id: 'weight-2',
    goatId: 'goat-1',
    date: new Date('2024-02-15'),
    weight: 67.2,
    notes: 'Good weight gain',
  },
  {
    id: 'weight-3',
    goatId: 'goat-1',
    date: new Date('2024-03-15'),
    weight: 68.8,
    notes: 'Pregnant, weight increasing',
  },
  // Max's weight records
  {
    id: 'weight-4',
    goatId: 'goat-2',
    date: new Date('2024-01-20'),
    weight: 85.2,
    notes: 'Breeding condition',
  },
  {
    id: 'weight-5',
    goatId: 'goat-2',
    date: new Date('2024-02-20'),
    weight: 87.1,
    notes: 'Maintaining good weight',
  },
  // Luna's weight records
  {
    id: 'weight-6',
    goatId: 'goat-3',
    date: new Date('2024-02-01'),
    weight: 52.3,
    notes: 'Young doe, still growing',
  },
  {
    id: 'weight-7',
    goatId: 'goat-3',
    date: new Date('2024-03-01'),
    weight: 54.7,
    notes: 'Good growth rate',
  },
];

export const sampleHealthRecords: HealthRecord[] = [
  {
    id: 'health-1',
    goatId: 'goat-1',
    date: new Date('2024-01-15'),
    type: 'vaccination',
    description: 'CDT (Clostridium perfringens types C & D and tetanus)',
    veterinarian: 'Dr. Sarah Johnson',
    nextDueDate: new Date('2025-01-15'),
    notes: 'Annual booster',
  },
  {
    id: 'health-2',
    goatId: 'goat-1',
    date: new Date('2024-02-10'),
    type: 'deworming',
    description: 'Ivermectin treatment',
    nextDueDate: new Date('2024-05-10'),
    notes: 'Fecal egg count was elevated',
  },
  {
    id: 'health-3',
    goatId: 'goat-2',
    date: new Date('2024-01-20'),
    type: 'vaccination',
    description: 'CDT vaccination',
    veterinarian: 'Dr. Sarah Johnson',
    nextDueDate: new Date('2025-01-20'),
    notes: 'Breeding buck vaccination',
  },
  {
    id: 'health-4',
    goatId: 'goat-2',
    date: new Date('2024-03-01'),
    type: 'checkup',
    description: 'Breeding soundness exam',
    veterinarian: 'Dr. Mike Wilson',
    notes: 'Excellent breeding condition',
  },
  {
    id: 'health-5',
    goatId: 'goat-3',
    date: new Date('2024-02-01'),
    type: 'vaccination',
    description: 'CDT vaccination',
    veterinarian: 'Dr. Sarah Johnson',
    nextDueDate: new Date('2025-02-01'),
    notes: 'First adult vaccination',
  },
  {
    id: 'health-6',
    goatId: 'goat-1',
    date: new Date('2024-03-20'),
    type: 'treatment',
    description: 'Hoof trimming and copper bolus',
    nextDueDate: new Date('2024-06-20'),
    notes: 'Routine maintenance',
  },
];

export function loadSampleData() {
  // Check if data already exists
  const existingGoats = localStorage.getItem('goats');
  if (existingGoats && JSON.parse(existingGoats).length > 0) {
    return false; // Data already exists
  }

  // Load sample data
  localStorage.setItem('goats', JSON.stringify(sampleGoats));
  localStorage.setItem('weightRecords', JSON.stringify(sampleWeightRecords));
  localStorage.setItem('healthRecords', JSON.stringify(sampleHealthRecords));
  localStorage.setItem('breedingRecords', JSON.stringify([]));
  
  return true; // Sample data loaded
}