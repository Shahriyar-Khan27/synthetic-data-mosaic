
import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 px-8 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10"
    >
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-medium tracking-tight">Synthetic Data Mosaic</h1>
      </motion.div>
      
      <div className="flex items-center gap-2">
        <motion.span 
          className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Professional Edition
        </motion.span>
      </div>
    </motion.header>
  );
};

export default Header;
