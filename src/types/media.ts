
export interface MediaFile {
  id: string;
  type: 'image' | 'video';
  filename: string;
  url: string;
  timestamp: Date;
  category: 'birth' | 'weaning' | 'breeding' | 'health' | 'milestone' | 'general';
  tags: string[];
  description?: string;
  fileSize: number;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface MediaUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface MediaGalleryConfig {
  allowMultiple: boolean;
  acceptedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  autoTimestamp: boolean;
  defaultCategory: MediaFile['category'];
}
