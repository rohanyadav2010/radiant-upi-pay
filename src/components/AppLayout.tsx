
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
  const { isSyncing, syncNow, syncStatus, lastSynced, isMockMode } = useSyncContext();
  
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
      {/* Premium gradient background with animated subtle movement */}
      <motion.div 
        className="fixed inset-0 -z-10"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(247,249,255,1) 0%, rgba(229,240,254,1) 35%, rgba(238,242,255,1) 70%, rgba(231,245,255,1) 100%)',
          backgroundSize: '200% 200%',
        }}
      />
      <div className="fixed inset-0 -z-5 backdrop-blur-[100px] dark:bg-black/80 dark:backdrop-blur-xl" />
      
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/10 dark:border-gray-800/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg px-2.5 py-1.5 rounded-full shadow-sm"
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
          {isMockMode && (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300">
              Mock
            </span>
          )}
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
          className="min-h-[calc(100vh-10rem)] overflow-y-auto scroll-area pb-20"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
};

export default AppLayout;
