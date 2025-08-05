
import { Goat } from '../types/goat';

export const sampleGoats: Goat[] = [
  {
    id: 'goat-1',
    name: 'Luna',
    breed: 'Nubian',
    tagNumber: '001',
    gender: 'female',
    dateOfBirth: new Date('2022-03-15'),
    color: 'Brown and white',
    status: 'active',
    hornStatus: 'disbudded',
    notes: 'Excellent milk producer, very gentle temperament',
    mediaFiles: [],
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'goat-2',
    name: 'Apollo',
    breed: 'Boer',
    tagNumber: '002',
    gender: 'male',
    dateOfBirth: new Date('2021-08-22'),
    color: 'White with red head',
    status: 'active',
    hornStatus: 'horned',
    notes: 'Strong breeding buck, good conformation',
    mediaFiles: [],
    createdAt: new Date('2021-08-22'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'goat-3',
    name: 'Clover',
    breed: 'Alpine',
    tagNumber: '003',
    gender: 'female',
    dateOfBirth: new Date('2023-01-10'),
    color: 'Cou clair',
    status: 'active',
    hornStatus: 'disbudded',
    notes: 'First-time mother, very attentive to kids',
    mediaFiles: [],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-01-15')
  }
];
