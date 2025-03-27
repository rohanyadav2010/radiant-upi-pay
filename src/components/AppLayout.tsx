
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const AppLayout = () => {
  const location = useLocation();
  
  return (
    <div className="app-container relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-[calc(100vh-4rem)] overflow-y-auto scroll-area pb-20"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
};

export default AppLayout;
