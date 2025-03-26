
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
      whileHover={{ y: -2 }}
      className="card-subtle flex items-center justify-between mb-3 hover-lift"
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
          type === 'sent' ? 'bg-red-100' : 'bg-green-100'
        }`}>
          {type === 'sent' ? (
            <ArrowUpRight className="text-red-500" size={18} />
          ) : (
            <ArrowDownLeft className="text-green-500" size={18} />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-gray-500 text-xs">{date}</p>
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
