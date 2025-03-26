
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface BalanceCardProps {
  balance: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = React.useState(true);
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      <div className="flex items-end mb-4">
        <h1 className="text-3xl font-bold mr-2">
          {showBalance ? balance : '••••••'}
        </h1>
        <span className="text-gray-500 text-sm mb-1">INR</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-primary rounded-xl py-2 flex items-center justify-center font-medium"
        >
          Add Money
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-secondary rounded-xl py-2 flex items-center justify-center font-medium"
        >
          Withdraw
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
