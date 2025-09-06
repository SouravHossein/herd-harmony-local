import exp from "constants";

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
export interface MediaGalleryConfig {
  allowMultiple: boolean;
  acceptedTypes: string[];
  maxFileSize: number; // in bytes
  maxFiles: number;
  autoTimestamp: boolean;
  defaultCategory: MediaFile['category'];
}
export interface MediaUploadProgress {
  fileId: string;
  progress: number; // 0-100
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}