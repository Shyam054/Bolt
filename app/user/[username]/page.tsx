'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Github, Twitter, Globe, Star, Download, Brain, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userData = {
  username: 'alex-researcher',
  name: 'Alex Rodriguez',
  bio: 'AI Researcher & Machine Learning Engineer passionate about open source and democratizing AI',
  location: 'San Francisco, CA',
  joined: 'March 2023',
  website: 'https://alexrodriguez.dev',
  github: 'alex-researcher',
  twitter: 'alex_ml_research',
  stats: {
    models: 12,
    datasets: 8,
    downloads: '2.4M',
    stars: '15.2K',
    followers: 892,
    following: 245,
  },
};

const userProjects = [
  {
    id: 1,
    name: 'GPT-4 Fine-tuned',
    description: 'A fine-tuned version of GPT-4 for code generation and debugging',
    type: 'model',
    downloads: '245K',
    stars: '3.2K',
    tags: ['NLP', 'Code Generation', 'Fine-tuning'],
    updated: '2 days ago',
  },
  {
    id: 2,
    name: 'Code Dataset 2024',
    description: 'Comprehensive dataset of clean, well-documented code from GitHub',
    type: 'dataset',
    downloads: '180K',
    stars: '2.8K',
    tags: ['Code', 'Dataset', 'Programming'],
    updated: '1 week ago',
  },
  {
    id: 3,
    name: 'Vision Transformer V2',
    description: 'Improved Vision Transformer with better performance on small datasets',
    type: 'model',
    downloads: '156K',
    stars: '2.1K',
    tags: ['Computer Vision', 'Transformer', 'Classification'],
    updated: '3 days ago',
  },
];

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          </div>

          <Card className="glass border-white/20 p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full blur-xl opacity-50" />
                <Avatar className="w-32 h-32 relative z-10 ring-4 ring-white/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-500 to-accent-400">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                      {userData.name}
                    </h1>
                    <p className="text-primary-400 text-lg font-medium mb-2">
                      @{userData.username}
                    </p>
                  </div>
                  <Button className="bg-primary-600 hover:bg-primary-700 glow w-fit">
                    Follow
                  </Button>
                </div>

                <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                  {userData.bio}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userData.joined}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <a href={userData.website} className="hover:text-primary-400 transition-colors">
                      {userData.website.replace('https://', '')}
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mb-6">
                  <Button variant="outline" size="sm" className="glass-hover border-white/20">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="glass-hover border-white/20">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {Object.entries(userData.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-sm text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="glass border-white/20 bg-white/5 p-1">
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
              >
                Projects ({userProjects.length})
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="starred"
                className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
              >
                Starred
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {userProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="glass glass-hover border-white/20 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              project.type === 'model' 
                                ? 'bg-primary-500/20 text-primary-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {project.type === 'model' ? <Brain className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-gray-400 text-sm">Updated {project.updated}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-white/20 text-gray-300">
                            {project.type}
                          </Badge>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300 border-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{project.downloads}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{project.stars}</span>
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
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-400">Activity feed coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="starred" className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-400">Starred projects coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}