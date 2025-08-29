'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Upload, User, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchCommand from '@/components/search-command';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'glass backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 glow"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-display font-bold gradient-text">
                MLShelf
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/explore" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Explore
              </Link>
              <Link 
                href="/upload" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Upload
              </Link>
              <Link 
                href="/community" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Community
              </Link>
            </div>

            {/* Search and Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="glass-hover border-white/20 text-gray-300 hover:text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
                <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white/10 rounded">⌘K</kbd>
              </Button>
              
              <Button 
                asChild
                className="bg-primary-600 hover:bg-primary-700 glow transition-all duration-300"
              >
                <Link href="/upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <User className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/explore"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/upload"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload
                </Link>
                <Link
                  href="/community"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start glass-hover border-white/20"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}