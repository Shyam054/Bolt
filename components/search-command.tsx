'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Database, Users, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [search, setSearch] = useState('');

  const suggestions = [
    { icon: <Brain className="w-4 h-4" />, title: 'GPT-4 Clone', type: 'Model', trending: true },
    { icon: <Database className="w-4 h-4" />, title: 'ImageNet 2024', type: 'Dataset', trending: false },
    { icon: <Brain className="w-4 h-4" />, title: 'BERT Fine-tuned', type: 'Model', trending: true },
    { icon: <Users className="w-4 h-4" />, title: 'OpenAI Research', type: 'User', trending: false },
  ];

  const filteredSuggestions = suggestions.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 p-0 gap-0 max-w-2xl">
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Input
            placeholder="Search models, datasets, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="ml-2 px-2 py-1 text-xs bg-white/10 rounded text-gray-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {search === '' ? (
            <div className="p-4">
              <p className="text-sm text-gray-400 mb-3">Popular searches</p>
              <div className="space-y-1">
                {suggestions.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                    </div>
                    {item.trending && (
                      <div className="flex items-center text-accent-400">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {filteredSuggestions.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-410">No results found for "{search}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}