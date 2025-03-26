
import React from 'react';
import { motion } from 'framer-motion';
import BalanceCard from '../components/BalanceCard';
import ActionButton from '../components/ActionButton';
import TransactionCard from '../components/TransactionCard';
import { Send, Smartphone, Users, QrCode, RefreshCw } from 'lucide-react';

const Home = () => {
  // Simulate recent transactions data
  const recentTransactions = [
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
  ];

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
            Good Morning
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold"
          >
            Aditya Singh
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
        >
          AS
        </motion.div>
      </div>

      <BalanceCard balance="₹24,500.75" />

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
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<QrCode size={20} className="text-blue-500" />} 
            label="Scan" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<Smartphone size={20} className="text-blue-500" />} 
            label="Mobile" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActionButton 
            icon={<Users size={20} className="text-blue-500" />} 
            label="Contacts" 
          />
        </motion.div>
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-base">Recent Transactions</h2>
        <button className="text-primary text-sm font-medium flex items-center">
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
    </div>
  );
};

export default Home;
