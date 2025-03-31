
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

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-lg py-2 px-4 flex items-center justify-between">
        {navItems.map((item) => (
          <Link 
            key={item.to} 
            to={item.to} 
            className={`flex flex-col items-center justify-center ${
              item.isMiddle ? 'relative -mt-8' : 'py-1'
            }`}
          >
            {item.isMiddle ? (
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="text-white"
                >
                  {item.icon}
                </motion.div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <span className={`text-${location.pathname === item.to ? 'primary' : 'gray-500'}`}>
                    {item.icon}
                  </span>
                  {location.pathname === item.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </div>
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
    </div>
  );
};

export default BottomNav;
