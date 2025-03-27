
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Smartphone,
  Mail,
  MapPin,
  Shield,
  FileText,
  Key,
  Clock,
  Wallet,
  CreditCardIcon,
  Building,
  BellRing,
  BellOff,
  MessageSquare,
  PhoneCall,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
  
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
      description: 'Manage your personal details',
      details: [
        { icon: <User size={16} />, label: 'Name', value: 'Kunal Yadav' },
        { icon: <Mail size={16} />, label: 'Email', value: 'kunal@gmail.com' },
        { icon: <Smartphone size={16} />, label: 'Phone', value: '+91 9876543210' },
        { icon: <MapPin size={16} />, label: 'Address', value: 'Delhi, India' }
      ]
    },
    {
      id: 'security',
      icon: <Lock size={20} className="text-green-500" />,
      title: 'Security & Privacy',
      description: 'Control your security preferences',
      details: [
        { icon: <Shield size={16} />, label: 'Two-Factor Authentication', value: 'Enabled' },
        { icon: <FileText size={16} />, label: 'Privacy Policy', value: 'View' },
        { icon: <Key size={16} />, label: 'Change Password', value: 'Update' },
        { icon: <Clock size={16} />, label: 'Session Timeout', value: '15 minutes' }
      ]
    },
    {
      id: 'payment',
      icon: <CreditCard size={20} className="text-purple-500" />,
      title: 'Payment Methods',
      description: 'Add or manage payment options',
      details: [
        { icon: <Wallet size={16} />, label: 'UPI', value: '9876543210@upi' },
        { icon: <CreditCardIcon size={16} />, label: 'Credit/Debit Cards', value: '3 Cards' },
        { icon: <Building size={16} />, label: 'Bank Accounts', value: '2 Accounts' },
        { icon: <ArrowUpRight size={16} />, label: 'Add New Method', value: '+' }
      ]
    },
    {
      id: 'notifications',
      icon: <Bell size={20} className="text-yellow-500" />,
      title: 'Notifications',
      description: 'Customize notification settings',
      details: [
        { icon: <BellRing size={16} />, label: 'Push Notifications', value: 'On' },
        { icon: <Mail size={16} />, label: 'Email Notifications', value: 'Off' },
        { icon: <BellOff size={16} />, label: 'Quiet Hours', value: '10 PM - 7 AM' },
        { icon: <Bell size={16} />, label: 'Transaction Alerts', value: 'On' }
      ]
    },
    {
      id: 'help',
      icon: <HelpCircle size={20} className="text-gray-500" />,
      title: 'Help & Support',
      description: 'Get help with the app',
      details: [
        { icon: <MessageSquare size={16} />, label: 'Chat Support', value: '24/7' },
        { icon: <PhoneCall size={16} />, label: 'Call Center', value: '9 AM - 6 PM' },
        { icon: <Mail size={16} />, label: 'Email Support', value: 'support@pay.com' },
        { icon: <HelpCircle size={16} />, label: 'FAQs', value: 'View' }
      ]
    }
  ];

  const handleExpandSetting = (id: string) => {
    if (expandedSetting === id) {
      setExpandedSetting(null);
    } else {
      setExpandedSetting(id);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully"
    });
    
    // Remove login info
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="section pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="flex items-center justify-center mb-4">
        <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
      </div>

      <div className="flex items-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4"
        >
          KY
        </motion.div>
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-lg"
          >
            Kunal Yadav
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm"
          >
            kunal@gmail.com
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
            className="glass-card rounded-xl overflow-hidden hover-lift cursor-pointer"
          >
            <div 
              className="p-4 flex items-center justify-between"
              onClick={() => handleExpandSetting(item.id)}
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
              <ChevronRight size={18} className={`text-gray-400 transition-transform ${expandedSetting === item.id ? 'rotate-90' : ''}`} />
            </div>
            
            {expandedSetting === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                {item.details.map((detail, index) => (
                  <div 
                    key={index}
                    className="p-3 pl-16 flex items-center justify-between text-sm border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">{detail.icon}</span>
                      <span>{detail.label}</span>
                    </div>
                    <span className={`font-medium ${detail.value === 'On' ? 'text-green-500' : 
                                              detail.value === 'Off' ? 'text-red-500' : 
                                              detail.value === '+' ? 'text-blue-500' : 
                                              detail.value === 'View' || detail.value === 'Update' ? 'text-blue-500 underline' : 
                                              ''}`}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
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
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-red-200 text-red-500 font-medium hover-lift"
        >
          <LogOut size={18} className="mr-2" /> Log Out
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
