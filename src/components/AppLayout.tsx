
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { useSyncContext } from '@/store/SyncContext';
import { Loader2, CloudCog } from 'lucide-react';

const AppLayout = () => {
  const location = useLocation();
  const { isSyncing, syncNow, syncStatus, lastSynced } = useSyncContext();
  
  const pageVariants = {
    initial: { 
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.98,
      transition: { 
        duration: 0.2, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };
  
  return (
    <div className="app-container relative overflow-hidden">
      {/* Dynamic background that works better with dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10"></div>
      
      <div className="flex justify-between items-center p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
          onClick={syncNow}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CloudCog size={16} />
          )}
          <span className="hidden sm:inline">
            {lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleTimeString()}` : 'Sync now'}
          </span>
        </motion.button>
        
        <ThemeToggle />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-[calc(100vh-5rem)] overflow-y-auto scroll-area pb-20"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
};

export default AppLayout;
