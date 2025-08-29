'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Brain, Database, Download, Star, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const models = [
  {
    id: 1,
    name: 'GPT-4 Clone',
    author: 'OpenAI Research',
    description: 'A powerful language model trained on diverse internet text, capable of understanding and generating human-like responses.',
    tags: ['NLP', 'Language Model', 'Transformer'],
    downloads: '2.4M',
    stars: '12.5K',
    updated: '2 days ago',
    type: 'model',
    category: 'NLP',
    trending: true,
  },
  {
    id: 2,
    name: 'ImageNet 2024',
    author: 'Stanford Research',
    description: 'Latest version of the ImageNet dataset with improved annotations and additional categories.',
    tags: ['Computer Vision', 'Dataset', 'Classification'],
    downloads: '1.8M',
    stars: '8.2K',
    updated: '1 week ago',
    type: 'dataset',
    category: 'Computer Vision',
    trending: true,
  },
  {
    id: 3,
    name: 'BERT Fine-tuned',
    author: 'Google AI',
    description: 'Pre-trained BERT model fine-tuned for various downstream tasks including sentiment analysis.',
    tags: ['NLP', 'BERT', 'Fine-tuning'],
    downloads: '1.2M',
    stars: '6.8K',
    updated: '3 days ago',
    type: 'model',
    category: 'NLP',
    trending: false,
  },
  {
    id: 4,
    name: 'COCO Dataset Enhanced',
    author: 'Microsoft Research',
    description: 'Enhanced COCO dataset with additional object detection annotations and segmentation masks.',
    tags: ['Computer Vision', 'Object Detection', 'Segmentation'],
    downloads: '950K',
    stars: '5.3K',
    updated: '5 days ago',
    type: 'dataset',
    category: 'Computer Vision',
    trending: false,
  },
  {
    id: 5,
    name: 'Whisper v3',
    author: 'OpenAI',
    description: 'Robust speech recognition model that works well across different languages and accents.',
    tags: ['Audio', 'Speech Recognition', 'Multilingual'],
    downloads: '890K',
    stars: '7.1K',
    updated: '1 day ago',
    type: 'model',
    category: 'Audio',
    trending: true,
  },
  {
    id: 6,
    name: 'CommonVoice 2024',
    author: 'Mozilla',
    description: 'Large-scale multilingual speech dataset for training speech recognition and synthesis models.',
    tags: ['Audio', 'Speech', 'Multilingual'],
    downloads: '720K',
    stars: '4.9K',
    updated: '1 week ago',
    type: 'dataset',
    category: 'Audio',
    trending: false,
  },
];

const categories = ['All', 'NLP', 'Computer Vision', 'Audio', 'Multimodal', 'Reinforcement Learning'];
const sortOptions = ['Trending', 'Most Downloaded', 'Recently Updated', 'Most Starred'];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('Trending');
  const [showFilters, setShowFilters] = useState(false);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
    const matchesType = selectedType === 'all' || model.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            Explore ML Universe
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Discover cutting-edge models and datasets from the global AI community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search models, datasets, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 glass border-white/20 bg-white/5 text-white placeholder:text-gray-400 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-hover border-white/20 h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-lg p-6 border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="glass border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="model">Models</SelectItem>
                        <SelectItem value="dataset">Datasets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="glass border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="glass border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-xl p-6 border-white/20 sticky top-24">
              <h3 className="font-display font-bold text-xl mb-4 text-white">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-display font-bold text-xl mb-4 text-white">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Models</span>
                    <span className="text-white font-medium">12.4K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Datasets</span>
                    <span className="text-white font-medium">8.7K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-white font-medium">45.2K</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Model Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 flex justify-between items-center"
            >
              <p className="text-gray-300">
                Showing {filteredModels.length} results
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glass glass-hover border-white/20 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            model.type === 'model' 
                              ? 'bg-primary-500/20 text-primary-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {model.type === 'model' ? <Brain className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                {model.name}
                              </h3>
                              {model.trending && (
                                <TrendingUp className="w-4 h-4 text-accent-400" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">by {model.author}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-gray-300">
                          {model.type}
                        </Badge>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {model.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300 border-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{model.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{model.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{model.updated}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-primary-600 hover:bg-primary-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">No results found for your search.</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}