
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      to: '/', 
      icon: <Home size={20} />, 
      label: 'Home' 
    },
    { 
      to: '/pay', 
      icon: <Wallet size={20} />, 
      label: 'Pay',
      isMiddle: true
    },
    { 
      to: '/activity', 
      icon: <BarChart3 size={20} />, 
      label: 'Activity' 
    },
    { 
      to: '/settings', 
      icon: <Settings size={20} />, 
      label: 'Settings' 
    }
  ];

  // Animation variants
  const navVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 22,
        stiffness: 300
      }
    }
  };
  
  const buttonVariants = {
    tap: { scale: 0.95 }
  };
  
  const indicatorVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100/50 dark:border-gray-800/50 shadow-lg py-2 px-4 flex items-center justify-between rounded-t-3xl">
        {navItems.map((item) => (
          <Link 
            key={item.to} 
            to={item.to} 
            className={`flex flex-col items-center justify-center relative ${
              item.isMiddle ? 'relative -mt-8' : 'py-1'
            }`}
          >
            {item.isMiddle ? (
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <span className="text-white">
                  {item.icon}
                </span>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="relative p-2"
                  whileTap={buttonVariants.tap}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className={`text-${location.pathname === item.to ? 'primary' : 'gray-500 dark:text-gray-400'}`}>
                    {item.icon}
                  </span>
                  
                  {location.pathname === item.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  )}
                </motion.div>
                
                <span className={`text-xs mt-0.5 ${
                  location.pathname === item.to ? 'text-primary font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </>
            )}
            
            {location.pathname === item.to && !item.isMiddle && (
              <motion.div
                variants={indicatorVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20 -z-10"
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;
