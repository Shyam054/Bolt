import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Upload {
  id: string;
  file_name: string;
  file_type: 'model' | 'dataset';
  bucket: string;
  size: number;
  uploaded_at: string;
}

// Storage buckets
export const BUCKETS = {
  MODELS: 'ml-models',
  DATASETS: 'datasets'
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  model: ['.pkl', '.onnx', '.h5', '.pt', '.pth'],
  dataset: ['.csv', '.json', '.zip', '.parquet']
} as const;

// Helper functions
export const getFileExtension = (filename: string): string => {
  return '.' + filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidFileType = (filename: string, type: 'model' | 'dataset'): boolean => {
  const extension = getFileExtension(filename);
  return ALLOWED_FILE_TYPES[type].includes(extension as any);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};