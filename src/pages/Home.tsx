
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BalanceCard, { getGlobalBalance, setGlobalBalance, formatIndianCurrency } from '../components/BalanceCard';
import ActionButton from '../components/ActionButton';
import TransactionCard from '../components/TransactionCard';
import ScanModal from '../components/ScanModal';
import ContactsModal from '../components/ContactsModal';
import { Send, Smartphone, Users, QrCode, RefreshCw } from 'lucide-react';
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
  const [recentTransactions, setRecentTransactions] = useState([
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      amount: '₹2,500', 
      date: 'Today, 2:30 PM', 
      type: 'sent' as const 
    },
    { 
      id: 2, 
      name: 'Grocery Store', 
      amount: '₹750', 
      date: 'Yesterday, 6:15 PM', 
      type: 'sent' as const 
    },
    { 
      id: 3, 
      name: 'Priya M', 
      amount: '₹3,000', 
      date: 'Yesterday, 11:30 AM', 
      type: 'received' as const 
    },
    { 
      id: 4, 
      name: 'Electric Bill', 
      amount: '₹1,200', 
      date: '22 Jun, 9:45 AM', 
      type: 'sent' as const 
    }
  ]);

  useEffect(() => {
    // Get current time in India (IST is UTC+5:30)
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

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

  const handleRefresh = () => {
    toast({
      title: "Refreshing...",
      description: "Updating your recent transactions"
    });
    
    // Update balance with global value
    setBalance(getGlobalBalance());
    
    // Simulate refresh delay
    setTimeout(() => {
      toast({
        title: "Refreshed",
        description: "Your transactions are up to date"
      });
    }, 1500);
  };

  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance);
  };

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

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-base">Recent Transactions</h2>
        <button 
          className="text-primary text-sm font-medium flex items-center"
          onClick={handleRefresh}
        >
          <RefreshCw size={14} className="mr-1" /> Refresh
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recentTransactions.map((transaction) => (
          <motion.div key={transaction.id} variants={itemVariants}>
            <TransactionCard 
              name={transaction.name}
              amount={transaction.amount}
              date={transaction.date}
              type={transaction.type}
            />
          </motion.div>
        ))}
      </motion.div>

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
