'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadForm from '@/components/upload-form';
import FileList from '@/components/file-list';

export default function UploadPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            ML Repository
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your models and datasets to help advance the ML community
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="upload" className="space-y-8">
            <TabsList className="glass border-white/20 bg-white/5 p-1 grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-primary-600 data-[state=active]:text-white flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="data-[state=active]:bg-primary-600 data-[state=active]:text-white flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Files</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload"><UploadForm onUploadSuccess={handleUploadSuccess} /></TabsContent>
            <TabsContent value="files"><FileList refreshTrigger={refreshTrigger} /></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
