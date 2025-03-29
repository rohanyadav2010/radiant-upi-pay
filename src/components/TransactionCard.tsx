
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

type TransactionType = 'sent' | 'received';

interface TransactionCardProps {
  amount: string;
  name: string;
  date: string;
  type: TransactionType;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  amount, 
  name, 
  date, 
  type 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        mass: 1
      }}
      className="card-subtle flex items-center justify-between mb-3 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center">
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            type === 'sent' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {type === 'sent' ? (
            <ArrowUpRight className="text-red-500" size={18} />
          ) : (
            <ArrowDownLeft className="text-green-500" size={18} />
          )}
        </motion.div>
        <div>
          <p className="font-medium text-sm dark:text-white">{name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{date}</p>
        </div>
      </div>
      <p className={`font-semibold ${
        type === 'sent' ? 'text-red-500' : 'text-green-500'
      }`}>
        {type === 'sent' ? '-' : '+'}{amount}
      </p>
    </motion.div>
  );
};

export default TransactionCard;
