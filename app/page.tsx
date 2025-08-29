'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Database, Users, Zap, Github, Star, Upload, Code, Cpu, Network, TrendingUp, Download, Clock, Flame as Fire, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NeuralInfinity from '@/components/canvas/neural-infinity';
import ModelCarousel from '@/components/canvas/model-carousel';
import LayerStack from '@/components/canvas/layer-stack';
import UploadOrbits from '@/components/canvas/upload-orbits';
import TunnelAPI from '@/components/canvas/tunnel-api';
import ParticlesExplode from '@/components/canvas/particles-explode';

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI Models',
    description: 'Upload, share, and discover cutting-edge machine learning models from the community.',
    gradient: 'from-blue-500 to-purple-600',
    delay: 0,
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Datasets',
    description: 'Access high-quality datasets for training and research purposes.',
    gradient: 'from-green-500 to-teal-600',
    delay: 0.1,
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Collaboration',
    description: 'Connect with researchers and developers worldwide to advance AI together.',
    gradient: 'from-orange-500 to-red-600',
    delay: 0.2,
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Deploy Instantly',
    description: 'Deploy your models with one click and create APIs for immediate use.',
    gradient: 'from-yellow-500 to-orange-600',
    delay: 0.3,
  },
];

const trendingModels = [
  { 
    name: 'GPT-4 Sentiment Pro', 
    author: 'OpenAI Research', 
    downloads: '2.4M', 
    views: '12.8M',
    likes: '45.2K',
    type: 'Language Model',
    framework: 'PyTorch',
    description: 'Advanced sentiment analysis with GPT-4 architecture, fine-tuned for social media and customer feedback',
    tags: ['NLP', 'Sentiment Analysis', 'GPT-4', 'Fine-tuned'],
    trendingScore: 98,
    lastUpdated: '2 hours ago',
    verified: true,
    category: 'NLP',
    modelSize: '175B',
    accuracy: '94.2%',
  },
  { 
    name: 'VisionNet Ultra', 
    author: 'Meta AI Research', 
    downloads: '1.8M', 
    views: '9.2M',
    likes: '32.1K',
    type: 'Computer Vision',
    framework: 'TensorFlow',
    description: 'State-of-the-art image classification and object detection with real-time performance',
    tags: ['Computer Vision', 'Object Detection', 'Real-time', 'Mobile'],
    trendingScore: 95,
    lastUpdated: '5 hours ago',
    verified: true,
    category: 'CV',
    modelSize: '89M',
    accuracy: '96.8%',
  },
  { 
    name: 'AudioWave Transformer', 
    author: 'DeepMind', 
    downloads: '1.2M', 
    views: '6.7M',
    likes: '28.9K',
    type: 'Audio Processing',
    framework: 'JAX',
    description: 'Revolutionary audio processing and speech recognition with multilingual support',
    tags: ['Audio', 'Speech Recognition', 'Multilingual', 'Transformer'],
    trendingScore: 92,
    lastUpdated: '1 day ago',
    verified: true,
    category: 'Audio',
    modelSize: '340M',
    accuracy: '97.1%',
  },
  { 
    name: 'CodeGen Ultra V2', 
    author: 'GitHub Copilot Team', 
    downloads: '980K', 
    views: '5.1M',
    likes: '22.7K',
    type: 'Code Generation',
    framework: 'PyTorch',
    description: 'Next-generation code completion and generation with context awareness',
    tags: ['Code Generation', 'Programming', 'AI Assistant', 'Context-aware'],
    trendingScore: 89,
    lastUpdated: '3 days ago',
    verified: true,
    category: 'Code',
    modelSize: '6.7B',
    accuracy: '91.5%',
  },
];

const mlLayers = [
  {
    title: 'Data Layer',
    description: 'Raw datasets, preprocessing, and feature engineering',
    icon: <Database className="w-6 h-6" />,
    color: '#0057ff',
  },
  {
    title: 'Training Layer',
    description: 'Model architecture, hyperparameters, and optimization',
    icon: <Cpu className="w-6 h-6" />,
    color: '#00f5ff',
  },
  {
    title: 'Inference Layer',
    description: 'Model deployment, serving, and real-time predictions',
    icon: <Network className="w-6 h-6" />,
    color: '#cfff04',
  },
  {
    title: 'API Layer',
    description: 'RESTful APIs, SDKs, and integration endpoints',
    icon: <Code className="w-6 h-6" />,
    color: '#ff6b6b',
  },
];

const liveUpdates = [
  "🆕 New Model: EfficientNet B7 by @research_lab",
  "✅ Model Verified: BERT-Large by @huggingface", 
  "🔥 Trending: Stable Diffusion XL - 50K downloads today",
  "🚀 Just Deployed: GPT-3.5 Fine-tune by @openai_dev",
  "⭐ Featured: YOLOv8 Object Detection - Community Choice",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isExploding, setIsExploding] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animations for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values for different sections
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -200]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);

  const modelsY = useTransform(smoothProgress, [0.1, 0.3], [100, 0]);
  const modelsOpacity = useTransform(smoothProgress, [0.1, 0.25], [0, 1]);

  const featuresY = useTransform(smoothProgress, [0.25, 0.45], [100, 0]);
  const featuresOpacity = useTransform(smoothProgress, [0.25, 0.4], [0, 1]);

  const layersY = useTransform(smoothProgress, [0.4, 0.6], [100, 0]);
  const layersOpacity = useTransform(smoothProgress, [0.4, 0.55], [0, 1]);

  const uploadY = useTransform(smoothProgress, [0.55, 0.75], [100, 0]);
  const uploadOpacity = useTransform(smoothProgress, [0.55, 0.7], [0, 1]);

  const apiY = useTransform(smoothProgress, [0.7, 0.9], [100, 0]);
  const apiOpacity = useTransform(smoothProgress, [0.7, 0.85], [0, 1]);

  const ctaY = useTransform(smoothProgress, [0.85, 1], [100, 0]);
  const ctaOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Live updates ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = () => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 2000);
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'PyTorch':
        return '🔥';
      case 'TensorFlow':
        return '🧠';
      case 'JAX':
        return '⚡';
      default:
        return '🤖';
    }
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Live Updates Ticker */}
      <motion.div 
        className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary-600/90 to-accent-400/90 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <motion.div 
            className="flex items-center justify-center text-white text-sm font-medium"
            key={currentUpdate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-2 h-2 bg-accent-400 rounded-full mr-3 animate-pulse" />
            {liveUpdates[currentUpdate]}
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Section with Enhanced Neural Infinity */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-dark-950 to-dark-900" />}>
            <NeuralInfinity 
              scrollProgress={smoothProgress} 
              mousePosition={mousePosition}
            />
          </Suspense>
        </div>
        
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto text-center px-4"
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            scale: heroScale
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-display font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="gradient-text inline-block"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your Central Shelf
              </motion.span>
              <br />
              <motion.span 
                className="text-white inline-block text-4xl md:text-6xl"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                for All Things
              </motion.span>
              <br />
              <motion.span 
                className="gradient-text inline-block"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Machine Learning
              </motion.span>
            </motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center space-x-8 mb-8"
          >
            <motion.div 
              className="flex items-center space-x-2 text-accent-400 font-bold"
              whileHover={{ scale: 1.1 }}
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </motion.div>
            <div className="w-2 h-2 bg-white rounded-full" />
            <motion.div 
              className="flex items-center space-x-2 text-primary-400 font-bold"
              whileHover={{ scale: 1.1 }}
            >
              <Eye className="w-5 h-5" />
              <span>Discover</span>
            </motion.div>
            <div className="w-2 h-2 bg-white rounded-full" />
            <motion.div 
              className="flex items-center space-x-2 text-accent-400 font-bold"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-5 h-5" />
              <span>Deploy</span>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Join the global ML community by sharing your models and datasets with rich metadata, 
            version control, and blazing-fast preview tools.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(207, 255, 4, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-dark-950 font-bold text-lg px-8 py-4 relative overflow-hidden group"
              >
                <Link href="/upload">
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    initial={false}
                  />
                  <Upload className="mr-2 w-5 h-5" />
                  Upload Your First Model
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 87, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="glass-hover border-white/20 text-lg px-8 py-4 backdrop-blur-xl group"
              >
                <Link href="#trending">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Browse Trending Models
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-16 flex items-center justify-center space-x-8 text-gray-400"
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.1, color: "#cfff04" }}
            >
              <Star className="w-5 h-5 text-accent-400" />
              <span>Open Source</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.1, color: "#0057ff" }}
            >
              <Github className="w-5 h-5" />
              <span>Community Driven</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.1, color: "#cfff04" }}
            >
              <Users className="w-5 h-5" />
              <span>45K+ Researchers</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Trending Models Section */}
      <section id="trending" className="relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <ModelCarousel 
              models={trendingModels}
              scrollProgress={smoothProgress}
            />
          </Suspense>
        </div>
        
        <motion.div
          style={{ 
            y: modelsY, 
            opacity: modelsOpacity 
          }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Fire className="w-8 h-8 text-accent-400 mr-3" />
              <h2 className="text-5xl md:text-6xl font-display font-bold gradient-text">
                Trending This Week
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Most downloaded & highest rated ML models, updated hourly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trendingModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -100 : 100, 
                  rotateY: index % 2 === 0 ? -15 : 15,
                  z: -200
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 0,
                  z: 0
                }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 80
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: index % 2 === 0 ? 3 : -3,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <Card className="glass glass-hover border-white/20 relative overflow-hidden h-full">
                  {/* Trending Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <motion.div 
                      className="flex items-center space-x-1 bg-gradient-to-r from-accent-400 to-accent-500 text-dark-950 px-3 py-1 rounded-full text-xs font-bold"
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(207, 255, 4, 0.5)",
                          "0 0 20px rgba(207, 255, 4, 0.8)",
                          "0 0 10px rgba(207, 255, 4, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Fire className="w-3 h-3" />
                      <span>#{index + 1}</span>
                    </motion.div>
                  </div>

                  {/* Verification Badge */}
                  {model.verified && (
                    <div className="absolute top-4 left-4 z-20">
                      <motion.div 
                        className="flex items-center space-x-1 bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        <span>Verified</span>
                      </motion.div>
                    </div>
                  )}

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Header with Framework */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{getFrameworkIcon(model.framework)}</span>
                          <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                            {model.framework}
                          </span>
                        </div>
                        <motion.h3 
                          className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors"
                          layoutId={`model-title-${index}`}
                        >
                          {model.name}
                        </motion.h3>
                        <p className="text-gray-400 mb-1">by {model.author}</p>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{model.description}</p>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <motion.div 
                        className="text-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <div className="flex items-center justify-center space-x-1 text-accent-400 font-bold">
                          <Download className="w-4 h-4" />
                          <span className="text-lg">{model.downloads}</span>
                        </div>
                        <div className="text-xs text-gray-400">downloads</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <div className="flex items-center justify-center space-x-1 text-primary-400 font-bold">
                          <Eye className="w-4 h-4" />
                          <span className="text-lg">{model.views}</span>
                        </div>
                        <div className="text-xs text-gray-400">views</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <div className="flex items-center justify-center space-x-1 text-red-400 font-bold">
                          <Heart className="w-4 h-4" />
                          <span className="text-lg">{model.likes}</span>
                        </div>
                        <div className="text-xs text-gray-400">likes</div>
                      </motion.div>
                    </div>

                    {/* Model Details */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{model.lastUpdated}</span>
                        </div>
                        <div>Size: {model.modelSize}</div>
                        <div>Acc: {model.accuracy}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {model.tags.map((tag) => (
                        <motion.div
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge variant="secondary" className="bg-white/5 text-gray-300 border-0 hover:bg-white/10 transition-colors">
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <motion.span 
                        className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 87, 255, 0.3)" }}
                      >
                        {model.type}
                      </motion.span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary-400 hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-500/10"
                      >
                        View Details
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Browse All Models CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary-600 to-accent-400 hover:from-primary-700 hover:to-accent-500 glow text-lg px-8 py-4"
            >
              <Link href="/explore">
                Explore All Models
                <TrendingUp className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Why MLShelf Features */}
      <section className="relative py-32 px-4">
        <motion.div
          style={{ 
            y: featuresY, 
            opacity: featuresOpacity 
          }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold gradient-text mb-6">
              Why MLShelf?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built by researchers, for researchers. Everything you need to accelerate your ML journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50
                }}
                style={{ perspective: 1000 }}
                className="group cursor-pointer"
              >
                <Card className="glass glass-hover border-white/20 h-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`
                    }}
                  />
                  <CardContent className="p-8 relative z-10">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ML Layer Stack 3D */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <LayerStack 
              layers={mlLayers}
              scrollProgress={smoothProgress}
            />
          </Suspense>
        </div>
        
        <motion.div
          style={{ 
            y: layersY, 
            opacity: layersOpacity 
          }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >
          <motion.h2 
            className="text-5xl font-display font-bold gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            The Complete ML Stack
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            From data to deployment, MLShelf covers every layer of your machine learning workflow
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mlLayers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="glass border-white/20 p-6 h-full">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                  >
                    {layer.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{layer.title}</h3>
                  <p className="text-gray-300 text-sm">{layer.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Upload Orbits Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <UploadOrbits scrollProgress={smoothProgress} />
          </Suspense>
        </div>
        
        <motion.div
          style={{ 
            y: uploadY, 
            opacity: uploadOpacity 
          }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            className="text-5xl font-display font-bold gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Upload Anything
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Support for all major ML formats and frameworks. Your models, your way.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              asChild
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 glow text-lg px-8 py-4"
            >
              <Link href="/upload">
                <Upload className="mr-2 w-5 h-5" />
                Start Uploading
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* API Tunnel Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <TunnelAPI scrollProgress={smoothProgress} />
          </Suspense>
        </div>
        
        <motion.div
          style={{ 
            y: apiY, 
            opacity: apiOpacity 
          }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            className="text-5xl font-display font-bold gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Powerful APIs
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Deploy your models instantly with our REST APIs and SDKs. Scale from prototype to production.
          </motion.p>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {['REST API', 'Python SDK', 'Node.js SDK'].map((item, index) => (
              <Card key={index} className="glass border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item}</h3>
                <p className="text-gray-300 text-sm">Easy integration with your existing workflow</p>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section with Particle Explosion */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <ParticlesExplode isExploding={isExploding} />
          </Suspense>
        </div>
        
        <motion.div
          style={{ 
            y: ctaY, 
            opacity: ctaOpacity 
          }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <Card className="glass rounded-3xl p-16 border-white/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-400/10"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(0,87,255,0.1) 0%, transparent 50%, rgba(207,255,4,0.1) 100%)",
                  "linear-gradient(225deg, rgba(207,255,4,0.1) 0%, transparent 50%, rgba(0,87,255,0.1) 100%)",
                  "linear-gradient(135deg, rgba(0,87,255,0.1) 0%, transparent 50%, rgba(207,255,4,0.1) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.h2 
              className="text-4xl md:text-5xl font-display font-bold gradient-text mb-6 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Shape the Future?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of researchers and developers building the next generation of AI
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  size="lg" 
                  className="bg-primary-600 hover:bg-primary-700 glow relative overflow-hidden group"
                  onClick={handleCTAClick}
                >
                  <Link href="/upload">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    />
                    Start Contributing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/5 backdrop-blur-xl">
                  <Link href="/explore">
                    Explore First
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}