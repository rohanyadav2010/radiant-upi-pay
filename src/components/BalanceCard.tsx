
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, ArrowDownLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BalanceCardProps {
  balance: string;
  onBalanceChange?: (newBalance: number) => void;
}

// Create a global variable to store balance
let globalBalance = 225925; // ₹2,25,925

export const getGlobalBalance = () => globalBalance;
export const setGlobalBalance = (newBalance: number) => {
  globalBalance = newBalance;
};

// Helper function to format currency with commas (Indian style)
export const formatIndianCurrency = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN');
};

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onBalanceChange }) => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const { toast } = useToast();
  
  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };
  
  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };
  
  const processAddMoney = () => {
    const amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }
    
    // Update global balance
    const newBalance = globalBalance + amount;
    setGlobalBalance(newBalance);
    
    // Notify parent components
    if (onBalanceChange) {
      onBalanceChange(newBalance);
    }
    
    // Show success message
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to your account`
    });
    
    // Reset state
    setAmountInput('');
    setShowAddMoneyModal(false);
  };
  
  const processWithdraw = () => {
    const amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }
    
    if (amount > globalBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to withdraw this amount"
      });
      return;
    }
    
    // Update global balance
    const newBalance = globalBalance - amount;
    setGlobalBalance(newBalance);
    
    // Notify parent components
    if (onBalanceChange) {
      onBalanceChange(newBalance);
    }
    
    // Show success message
    toast({
      title: "Withdrawal Successful",
      description: `₹${amount} has been withdrawn from your account`
    });
    
    // Reset state
    setAmountInput('');
    setShowWithdrawModal(false);
  };
  
  const closeModal = () => {
    setShowAddMoneyModal(false);
    setShowWithdrawModal(false);
    setAmountInput('');
  };
  
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
          {showBalance ? formatIndianCurrency(globalBalance) : '••••••'}
        </h1>
        <span className="text-gray-500 text-sm mb-1">INR</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-primary rounded-xl py-2 flex items-center justify-center font-medium"
          onClick={handleAddMoney}
        >
          <Plus size={16} className="mr-1" /> Add Money
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-secondary rounded-xl py-2 flex items-center justify-center font-medium"
          onClick={handleWithdraw}
        >
          <ArrowDownLeft size={16} className="mr-1" /> Withdraw
        </motion.button>
      </div>
      
      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 m-4 w-full max-w-sm">
            <h3 className="font-bold text-xl mb-4 dark:text-white">Add Money</h3>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Enter amount"
              className="w-full text-center text-2xl font-bold py-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors dark:text-white mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={processAddMoney}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdraw Money Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 m-4 w-full max-w-sm">
            <h3 className="font-bold text-xl mb-4 dark:text-white">Withdraw Money</h3>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Enter amount"
              className="w-full text-center text-2xl font-bold py-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors dark:text-white mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={processWithdraw}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BalanceCard;
