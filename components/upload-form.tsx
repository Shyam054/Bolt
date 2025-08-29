'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Brain, Database, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase, BUCKETS, isValidFileType, formatFileSize, type Upload as UploadType } from '@/lib/supabase';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

export default function UploadForm({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [fileType, setFileType] = useState<'model' | 'dataset'>('model');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [fileType]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, [fileType]);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!isValidFileType(file.name, fileType)) {
        toast.error(`Invalid file type: ${file.name}. Please select a valid ${fileType} file.`);
        return false;
      }
      return true;
    });

    const filesWithId = validFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...filesWithId]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const uploadFile = async (file: FileWithPreview): Promise<boolean> => {
    try {
      const bucket = fileType === 'model' ? BUCKETS.MODELS : BUCKETS.DATASETS;
      const fileName = `${Date.now()}-${file.name}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(prev => ({ ...prev, [file.id]: percentage }));
          }
        });

      if (uploadError) {
        throw uploadError;
      }

      // Insert metadata into database
      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          file_name: file.name,
          file_type: fileType,
          bucket: bucket,
          size: file.size
        });

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from(bucket).remove([fileName]);
        throw dbError;
      }

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      return false;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    const results = await Promise.all(files.map(uploadFile));
    const successCount = results.filter(Boolean).length;
    
    if (successCount === files.length) {
      toast.success(`Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`);
      setFiles([]);
      setUploadProgress({});
      onUploadSuccess?.();
    } else {
      toast.error(`Uploaded ${successCount} of ${files.length} files`);
    }
    
    setIsUploading(false);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pkl':
      case 'onnx':
      case 'h5':
      case 'pt':
      case 'pth':
        return <Brain className="w-5 h-5 text-primary-400" />;
      case 'csv':
      case 'json':
      case 'zip':
      case 'parquet':
        return <Database className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAllowedTypes = (type: 'model' | 'dataset') => {
    return type === 'model' 
      ? '.pkl, .onnx, .h5, .pt, .pth'
      : '.csv, .json, .zip, .parquet';
  };

  return (
    <Card className="glass border-white/20">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* File Type Selection */}
          <div>
            <label className="text-lg font-medium text-white mb-4 block">
              What are you uploading?
            </label>
            <Select value={fileType} onValueChange={(value: 'model' | 'dataset') => setFileType(value)}>
              <SelectTrigger className="glass border-white/20 bg-white/5 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-primary-400" />
                    <span>ML Model</span>
                  </div>
                </SelectItem>
                <SelectItem value="dataset">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span>Dataset</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400 mt-2">
              Allowed types: {getAllowedTypes(fileType)}
            </p>
          </div>

          {/* Drop Zone */}
          <motion.div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary-400 bg-primary-500/10'
                : 'border-white/20 hover:border-white/40'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept={getAllowedTypes(fileType)}
            />
            
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
              </h3>
              <p className="text-gray-400 mb-4">
                Upload your {fileType === 'model' ? 'ML models' : 'datasets'} to share with the community
              </p>
              <Badge variant="outline" className="border-white/20 text-gray-300">
                Max file size: 100MB
              </Badge>
            </motion.div>
          </motion.div>

          {/* File Preview */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-white">Selected Files ({files.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 glass rounded-lg border-white/10"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{file.name}</p>
                          <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {uploadProgress[file.id] !== undefined && (
                          <div className="w-20">
                            <Progress value={uploadProgress[file.id]} className="h-2" />
                          </div>
                        )}
                        
                        {uploadProgress[file.id] === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : uploadProgress[file.id] !== undefined ? (
                          <div className="text-xs text-gray-400">
                            {Math.round(uploadProgress[file.id])}%
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="p-1 h-auto text-gray-400 hover:text-red-400"
                            disabled={isUploading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Button */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-primary-600 hover:bg-primary-700 glow"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {files.length} file{files.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}