
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TransactionCard from '../components/TransactionCard';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

const Activity = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Simulated transaction data
  const transactions = [
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
    },
    { 
      id: 5, 
      name: 'Ajay Verma', 
      amount: '₹5,000', 
      date: '20 Jun, 3:20 PM', 
      type: 'received' as const 
    },
    { 
      id: 6, 
      name: 'Internet Bill', 
      amount: '₹999', 
      date: '18 Jun, 10:10 AM', 
      type: 'sent' as const 
    },
    { 
      id: 7, 
      name: 'Water Bill', 
      amount: '₹450', 
      date: '15 Jun, 9:30 AM', 
      type: 'sent' as const 
    },
    { 
      id: 8, 
      name: 'Ravi Kumar', 
      amount: '₹1,800', 
      date: '12 Jun, 5:45 PM', 
      type: 'received' as const 
    }
  ];

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
        <h1 className="text-xl font-bold">Activity</h1>
        <button 
          className="text-gray-500 flex items-center"
          onClick={() => {}}
        >
          <Calendar size={18} className="mr-1" /> 
          June 2023
        </button>
      </div>

      <div className="mb-6">
        <div 
          className="glass-card rounded-xl p-4 mb-2 flex justify-between items-center cursor-pointer"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Filter Transactions</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-600 transition-transform ${filterOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        <motion.div 
          variants={filterVariants}
          initial="hidden"
          animate={filterOpen ? "visible" : "hidden"}
          className="overflow-hidden"
        >
          <div className="card-subtle mt-2">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTransactions.map((transaction) => (
          <motion.div key={transaction.id} variants={itemVariants}>
            <TransactionCard 
              name={transaction.name}
              amount={transaction.amount}
              date={transaction.date}
              type={transaction.type}
            />
          </motion.div>
        ))}

        {filteredTransactions.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-10"
          >
            <p className="text-gray-500">No transactions found</p>
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
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </motion.button>
  );
};

export default Activity;
