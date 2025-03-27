
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransactionCard from '../components/TransactionCard';
import { Calendar, Filter, ChevronDown } from 'lucide-react';
import { getTransactions, TransactionData } from '@/store/TransactionStore';

const Activity = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  
  // Load transactions on mount and when they change
  useEffect(() => {
    setTransactions(getTransactions());
    
    // Set up a listener to refresh transactions when localStorage changes
    const handleStorageChange = () => {
      setTransactions(getTransactions());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh every 2 seconds to catch changes from other components
    const interval = setInterval(() => {
      setTransactions(getTransactions());
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Filter transactions based on active filter
  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    return transaction.type === activeFilter;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="section pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold dark:text-white">Activity</h1>
        <button 
          className="text-gray-500 dark:text-gray-400 flex items-center"
          onClick={() => {}}
        >
          <Calendar size={18} className="mr-1" /> 
          {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
        </button>
      </div>

      <div className="mb-6">
        <div 
          className="glass-card rounded-xl p-4 mb-2 flex justify-between items-center cursor-pointer"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
            <span className="font-medium dark:text-white">Filter Transactions</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-600 dark:text-gray-400 transition-transform ${filterOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        <motion.div 
          variants={filterVariants}
          initial="hidden"
          animate={filterOpen ? "visible" : "hidden"}
          className="overflow-hidden"
        >
          <div className="card-subtle mt-2 dark:bg-gray-800">
            <div className="flex gap-2">
              <FilterButton 
                label="All" 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')} 
              />
              <FilterButton 
                label="Sent" 
                active={activeFilter === 'sent'} 
                onClick={() => setActiveFilter('sent')} 
              />
              <FilterButton 
                label="Received" 
                active={activeFilter === 'received'} 
                onClick={() => setActiveFilter('received')} 
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-4">
        <h2 className="font-bold text-base mb-4 dark:text-white">Transactions</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <motion.div key={transaction.id} variants={itemVariants}>
              <TransactionCard 
                name={transaction.name}
                amount={transaction.amount}
                date={transaction.date}
                type={transaction.type}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-10"
          >
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
        active 
          ? 'bg-primary text-white shadow-md shadow-primary/20' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}
    >
      {label}
    </motion.button>
  );
};

export default Activity;
