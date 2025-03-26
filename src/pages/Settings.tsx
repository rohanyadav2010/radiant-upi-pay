
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

const Settings = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const settingsItems = [
    {
      id: 'profile',
      icon: <User size={20} className="text-blue-500" />,
      title: 'Personal Information',
      description: 'Manage your personal details'
    },
    {
      id: 'security',
      icon: <Lock size={20} className="text-green-500" />,
      title: 'Security & Privacy',
      description: 'Control your security preferences'
    },
    {
      id: 'payment',
      icon: <CreditCard size={20} className="text-purple-500" />,
      title: 'Payment Methods',
      description: 'Add or manage payment options'
    },
    {
      id: 'notifications',
      icon: <Bell size={20} className="text-yellow-500" />,
      title: 'Notifications',
      description: 'Customize notification settings'
    },
    {
      id: 'help',
      icon: <HelpCircle size={20} className="text-gray-500" />,
      title: 'Help & Support',
      description: 'Get help with the app'
    }
  ];

  return (
    <div className="section pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="flex items-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4"
        >
          AS
        </motion.div>
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-lg"
          >
            Aditya Singh
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm"
          >
            aditya@gmail.com
          </motion.p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="mb-8 space-y-3"
      >
        {settingsItems.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="glass-card rounded-xl p-4 flex items-center justify-between hover-lift cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button 
          whileHover={{ y: -2 }}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-red-200 text-red-500 font-medium hover-lift"
        >
          <LogOut size={18} className="mr-2" /> Log Out
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
