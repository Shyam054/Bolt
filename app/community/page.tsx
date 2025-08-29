'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, TrendingUp, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const communityStats = [
  { icon: <Users className="w-6 h-6" />, label: 'Active Members', value: '45.2K' },
  { icon: <MessageCircle className="w-6 h-6" />, label: 'Discussions', value: '12.8K' },
  { icon: <Heart className="w-6 h-6" />, label: 'Contributions', value: '89.3K' },
  { icon: <Award className="w-6 h-6" />, label: 'Projects Shared', value: '21.1K' },
];

const discussions = [
  {
    id: 1,
    title: 'Best practices for fine-tuning large language models',
    author: 'Sarah Chen',
    replies: 24,
    likes: 156,
    category: 'NLP',
    timeAgo: '2 hours ago',
    trending: true,
  },
  {
    id: 2,
    title: 'Comparing different computer vision architectures for medical imaging',
    author: 'Dr. Michael Rodriguez',
    replies: 18,
    likes: 89,
    category: 'Computer Vision',
    timeAgo: '4 hours ago',
    trending: false,
  },
  {
    id: 3,
    title: 'Open source dataset for speech recognition in multiple languages',
    author: 'Alex Kim',
    replies: 31,
    likes: 203,
    category: 'Audio',
    timeAgo: '6 hours ago',
    trending: true,
  },
];

const topContributors = [
  { name: 'Sarah Chen', contributions: 127, avatar: 'sarah-chen' },
  { name: 'Dr. Michael Rodriguez', contributions: 98, avatar: 'michael-rodriguez' },
  { name: 'Alex Kim', contributions: 84, avatar: 'alex-kim' },
  { name: 'Emma Thompson', contributions: 76, avatar: 'emma-thompson' },
];

export default function CommunityPage() {
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
            Community Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Connect with researchers, share knowledge, and collaborate on the future of AI
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-xl p-6 border-white/20 text-center"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary-400">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Discussions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Recent Discussions</h2>
                <Button variant="outline" className="glass-hover border-white/20">
                  Start Discussion
                </Button>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="glass glass-hover border-white/20 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                {discussion.title}
                              </h3>
                              {discussion.trending && (
                                <TrendingUp className="w-4 h-4 text-accent-400" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">by {discussion.author}</p>
                          </div>
                          <Badge variant="outline" className="border-white/20 text-gray-300">
                            {discussion.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{discussion.likes} likes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{discussion.timeAgo}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-primary-400 hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Join Discussion
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-4">Community Guidelines</h3>
                  <div className="space-y-3 text-gray-300">
                    <p>• Be respectful and constructive in all interactions</p>
                    <p>• Share knowledge openly and help others learn</p>
                    <p>• Provide proper attribution for datasets and models</p>
                    <p>• Follow ethical AI practices and guidelines</p>
                    <p>• Keep discussions relevant and on-topic</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-4">Top Contributors</h3>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.avatar}`} />
                            <AvatarFallback className="bg-primary-500/20 text-primary-400">
                              {contributor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-400 rounded-full flex items-center justify-center">
                              <Award className="w-2 h-2 text-dark-950" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{contributor.name}</p>
                          <p className="text-gray-400 text-xs">{contributor.contributions} contributions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 glow">
                      Start Discussion
                    </Button>
                    <Button variant="outline" className="w-full glass-hover border-white/20">
                      Browse Topics
                    </Button>
                    <Button variant="outline" className="w-full glass-hover border-white/20">
                      Find Collaborators
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white font-medium text-sm">ML Paper Discussion</p>
                      <p className="text-gray-400 text-xs">Tomorrow, 2:00 PM UTC</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white font-medium text-sm">Dataset Showcase</p>
                      <p className="text-gray-400 text-xs">Friday, 4:00 PM UTC</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white font-medium text-sm">Open Source Sprint</p>
                      <p className="text-gray-400 text-xs">Next Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}