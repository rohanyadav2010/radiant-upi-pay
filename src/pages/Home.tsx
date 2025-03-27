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
import { addTransaction } from '@/store/TransactionStore';

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
  const [serviceAmount, setServiceAmount] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState({ title: '', icon: <></> });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
    
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
    
    const interval = setInterval(() => {
      setBalance(getGlobalBalance());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [navigate]);

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
  
  const handleServiceClick = (serviceTitle: string, serviceIcon: React.ReactElement) => {
    setCurrentService({ title: serviceTitle, icon: serviceIcon });
    setServiceModalOpen(true);
  };

  const handleServicePayment = () => {
    const amount = parseInt(serviceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to make this payment"
      });
      return;
    }

    const newBalance = balance - amount;
    setGlobalBalance(newBalance);
    setBalance(newBalance);

    addTransaction(
      currentService.title,
      "service@paypay",
      formatIndianCurrency(amount),
      'sent'
    );

    toast({
      title: "Payment Successful",
      description: `${formatIndianCurrency(amount)} paid for ${currentService.title}`
    });

    setServiceModalOpen(false);
    setServiceAmount('');
  };
  
  const services = [
    { title: 'Electricity Bill', icon: <Zap size={24} />, onClick: () => handleServiceClick('Electricity Bill', <Zap size={24} />) },
    { title: 'Mobile Recharge', icon: <Smartphone size={24} />, onClick: () => handleServiceClick('Mobile Recharge', <Smartphone size={24} />) },
    { title: 'Bill Payments', icon: <Receipt size={24} />, onClick: () => handleServiceClick('Bill Payments', <Receipt size={24} />) },
    { title: 'Credit Card', icon: <CreditCard size={24} />, onClick: () => handleServiceClick('Credit Card', <CreditCard size={24} />) },
    { title: 'Shopping', icon: <ShoppingCart size={24} />, onClick: () => handleServiceClick('Shopping', <ShoppingCart size={24} />) },
    { title: 'Insurance', icon: <Shield size={24} />, onClick: () => handleServiceClick('Insurance', <Shield size={24} />) },
    { title: 'Investments', icon: <DollarSign size={24} />, onClick: () => handleServiceClick('Investments', <DollarSign size={24} />) },
    { title: 'Food Delivery', icon: <Utensils size={24} />, onClick: () => handleServiceClick('Food Delivery', <Utensils size={24} />) },
    { title: 'Rewards', icon: <Gift size={24} />, onClick: () => handleServiceClick('Rewards', <Gift size={24} />) },
    { title: 'Tickets', icon: <Ticket size={24} />, onClick: () => handleServiceClick('Tickets', <Ticket size={24} />) },
    { title: 'Split Bills', icon: <Users2 size={24} />, onClick: () => handleServiceClick('Split Bills', <Users2 size={24} />) },
    { title: 'Tax Services', icon: <FileText size={24} />, onClick: () => handleServiceClick('Tax Services', <FileText size={24} />) }
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
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold"
        >
          KY
        </motion.div>
      </div>

      <div className="flex justify-center mb-4">
        <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
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

      <AnimatePresence>
        {scanModalOpen && (
          <ScanModal 
            isOpen={scanModalOpen} 
            onClose={() => setScanModalOpen(false)} 
            scanType={scanType}
          />
        )}
      </AnimatePresence>

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
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium"
                  disabled={mobileNumber.length !== 10}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contactsModalOpen && (
          <ContactsModal 
            isOpen={contactsModalOpen} 
            onClose={() => setContactsModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {serviceModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 m-4 w-full max-w-sm"
            >
              <div className="flex justify-center mb-4">
                <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-2 text-purple-500 dark:text-purple-400">
                  {currentService.icon}
                </div>
              </div>
              
              <h3 className="font-bold text-xl mb-2 dark:text-white text-center">{currentService.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Enter amount to pay</p>
              
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-lg">₹</span>
                  <input
                    type="number"
                    value={serviceAmount}
                    onChange={(e) => setServiceAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-lg font-bold"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setServiceModalOpen(false);
                    setServiceAmount('');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleServicePayment}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium"
                  disabled={!serviceAmount || parseInt(serviceAmount) <= 0}
                >
                  Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
