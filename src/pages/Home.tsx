
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BalanceCard, { getGlobalBalance, setGlobalBalance, formatIndianCurrency } from '../components/BalanceCard';
import ActionButton from '../components/ActionButton';
import ScanModal from '../components/ScanModal';
import ContactsModal from '../components/ContactsModal';
import ServiceCard from '../components/ServiceCard';
import { 
  Send, 
  Smartphone, 
  Users, 
  QrCode, 
  Zap, 
  Receipt, 
  CreditCard, 
  ShoppingCart, 
  Shield, 
  DollarSign, 
  Utensils, 
  Gift, 
  Users2, 
  FileText, 
  Ticket
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanType, setScanType] = useState<'qr' | 'mobile'>('qr');
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [mobileInputOpen, setMobileInputOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [greeting, setGreeting] = useState('Good Morning');
  const [balance, setBalance] = useState(() => getGlobalBalance());

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
    
    // Get current time in India (IST is UTC+5:30)
    const now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    const hour = now.getHours();
    
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    
    // Refresh balance periodically
    const interval = setInterval(() => {
      setBalance(getGlobalBalance());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  // Create container and item variants for staggered animations
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
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  const handleSendMoney = () => {
    navigate('/pay');
  };

  const handleScanQR = () => {
    setScanType('qr');
    setScanModalOpen(true);
  };

  const handleScanMobile = () => {
    setMobileInputOpen(true);
  };

  const handleMobileInputSubmit = () => {
    if (mobileNumber.length === 10) {
      // Redirect to pay page with the mobile number
      navigate('/pay', { 
        state: { 
          directUpiInput: `${mobileNumber}@upi`,
          directNameInput: `User (${mobileNumber})`,
          showDirectInput: true
        } 
      });
      setMobileInputOpen(false);
      setMobileNumber('');
    } else {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number"
      });
    }
  };

  const handleOpenContacts = () => {
    setContactsModalOpen(true);
  };

  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance);
  };
  
  const handleServiceClick = (serviceTitle: string) => {
    toast({
      title: serviceTitle,
      description: "This feature will be available soon"
    });
  };
  
  const services = [
    { title: 'Electricity Bill', icon: <Zap size={24} />, onClick: () => handleServiceClick('Electricity Bill') },
    { title: 'Mobile Recharge', icon: <Smartphone size={24} />, onClick: () => handleServiceClick('Mobile Recharge') },
    { title: 'Bill Payments', icon: <Receipt size={24} />, onClick: () => handleServiceClick('Bill Payments') },
    { title: 'Credit Card', icon: <CreditCard size={24} />, onClick: () => handleServiceClick('Credit Card') },
    { title: 'Shopping', icon: <ShoppingCart size={24} />, onClick: () => handleServiceClick('Shopping') },
    { title: 'Insurance', icon: <Shield size={24} />, onClick: () => handleServiceClick('Insurance') },
    { title: 'Investments', icon: <DollarSign size={24} />, onClick: () => handleServiceClick('Investments') },
    { title: 'Food Delivery', icon: <Utensils size={24} />, onClick: () => handleServiceClick('Food Delivery') },
    { title: 'Rewards', icon: <Gift size={24} />, onClick: () => handleServiceClick('Rewards') },
    { title: 'Tickets', icon: <Ticket size={24} />, onClick: () => handleServiceClick('Tickets') },
    { title: 'Split Bills', icon: <Users2 size={24} />, onClick: () => handleServiceClick('Split Bills') },
    { title: 'Tax Services', icon: <FileText size={24} />, onClick: () => handleServiceClick('Tax Services') }
  ];

  return (
    <div className="section pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm"
          >
            {greeting}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold"
          >
            Kunal Yadav
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
        >
          KY
        </motion.div>
      </div>

      <div className="flex justify-center mb-4">
        <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
      </div>

      <BalanceCard 
        balance={formatIndianCurrency(balance)} 
        onBalanceChange={handleBalanceChange}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="flex justify-between mb-8"
      >
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<Send size={20} className="text-blue-500" />} 
            label="Send" 
            onClick={handleSendMoney}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<QrCode size={20} className="text-blue-500" />} 
            label="Scan" 
            onClick={handleScanQR}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<Smartphone size={20} className="text-blue-500" />} 
            label="Mobile" 
            onClick={handleScanMobile}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<Users size={20} className="text-blue-500" />} 
            label="Contacts" 
            onClick={handleOpenContacts}
          />
        </motion.div>
      </motion.div>

      <div className="mb-4">
        <h2 className="font-bold text-base mb-4">Services</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-3"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={itemVariants}>
              <ServiceCard 
                title={service.title}
                icon={service.icon}
                onClick={service.onClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for QR/Mobile scanning */}
      <AnimatePresence>
        {scanModalOpen && (
          <ScanModal 
            isOpen={scanModalOpen} 
            onClose={() => setScanModalOpen(false)} 
            scanType={scanType}
          />
        )}
      </AnimatePresence>

      {/* Modal for Mobile Input */}
      <AnimatePresence>
        {mobileInputOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 m-4 w-full max-w-sm"
            >
              <h3 className="font-bold text-xl mb-4 dark:text-white">Enter Mobile Number</h3>
              <Input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="10-digit mobile number"
                className="mb-6 text-lg"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setMobileInputOpen(false);
                    setMobileNumber('');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMobileInputSubmit}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium"
                  disabled={mobileNumber.length !== 10}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal for Contacts */}
      <AnimatePresence>
        {contactsModalOpen && (
          <ContactsModal 
            isOpen={contactsModalOpen} 
            onClose={() => setContactsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
