
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      to: '/', 
      icon: <Home size={22} />, 
      label: 'Home' 
    },
    { 
      to: '/pay', 
      icon: <Wallet size={22} />, 
      label: 'Pay',
      isMiddle: true
    },
    { 
      to: '/activity', 
      icon: <BarChart3 size={22} />, 
      label: 'Activity' 
    },
    { 
      to: '/settings', 
      icon: <Settings size={22} />, 
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
        damping: 20,
        stiffness: 300
      }
    }
  };
  
  const buttonVariants = {
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-lg py-2 px-4 flex items-center justify-between">
        {navItems.map((item) => (
          <Link 
            key={item.to} 
            to={item.to} 
            className={`flex flex-col items-center justify-center ${
              item.isMiddle ? 'relative -mt-8' : 'py-1'
            }`}
          >
            {item.isMiddle ? (
              <motion.div
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <span className="text-primary-foreground">
                  {item.icon}
                </span>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="relative"
                  whileTap={buttonVariants.tap}
                >
                  <span className={`text-${location.pathname === item.to ? 'primary' : 'gray-500'}`}>
                    {item.icon}
                  </span>
                  {location.pathname === item.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full"
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  )}
                </motion.div>
                <span className={`text-xs mt-1 ${
                  location.pathname === item.to ? 'text-primary font-medium' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;
