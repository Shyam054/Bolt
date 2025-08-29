'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Brain, Database, Calendar, HardDrive, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase, formatFileSize, getPublicUrl, type Upload } from '@/lib/supabase';

export default function FileList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'model' | 'dataset'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');

  const fetchUploads = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('uploads')
        .select('*');

      // Apply filters
      if (filterType !== 'all') {
        query = query.eq('file_type', filterType);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('uploaded_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('uploaded_at', { ascending: true });
          break;
        case 'name':
          query = query.order('file_name', { ascending: true });
          break;
        case 'size':
          query = query.order('size', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let filteredData = data || [];

      // Apply search filter
      if (searchQuery) {
        filteredData = filteredData.filter(upload =>
          upload.file_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setUploads(filteredData);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [refreshTrigger, filterType, sortBy, searchQuery]);

  const handleDownload = async (upload: Upload) => {
    try {
      const fileName = `${new Date(upload.uploaded_at).getTime()}-${upload.file_name}`;
      const publicUrl = getPublicUrl(upload.bucket, fileName);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = upload.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${upload.file_name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (upload: Upload) => {
    if (!confirm(`Are you sure you want to delete ${upload.file_name}?`)) {
      return;
    }

    try {
      // Delete from storage
      const fileName = `${new Date(upload.uploaded_at).getTime()}-${upload.file_name}`;
      const { error: storageError } = await supabase.storage
        .from(upload.bucket)
        .remove([fileName]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploads')
        .delete()
        .eq('id', upload.id);

      if (dbError) {
        throw dbError;
      }

      toast.success(`Deleted ${upload.file_name}`);
      fetchUploads(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const getFileIcon = (fileType: string) => {
    return fileType === 'model' 
      ? <Brain className="w-5 h-5 text-primary-400" />
      : <Database className="w-5 h-5 text-green-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="glass border-white/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-300">Loading files...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/20">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="text-2xl font-display font-bold text-white">
            Uploaded Files ({uploads.length})
          </CardTitle>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/20 bg-white/5 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: 'all' | 'model' | 'dataset') => setFilterType(value)}>
              <SelectTrigger className="glass border-white/20 bg-white/5 w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="model">Models</SelectItem>
                <SelectItem value="dataset">Datasets</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'name' | 'size') => setSortBy(value)}>
              <SelectTrigger className="glass border-white/20 bg-white/5 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {uploads.length === 0 ? (
          <div className="text-center py-12 px-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Upload your first ML model or dataset to get started'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            <AnimatePresence>
              {uploads.map((upload, index) => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {getFileIcon(upload.file_type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium truncate">
                            {upload.file_name}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`border-0 text-xs ${
                              upload.file_type === 'model' 
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {upload.file_type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{formatFileSize(upload.size)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(upload.uploaded_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(upload)}
                        className="text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(upload)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}