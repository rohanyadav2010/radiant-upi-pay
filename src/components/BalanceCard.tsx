
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, ArrowDownLeft, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { addTransaction, saveGlobalBalance, loadGlobalBalance } from '@/store/TransactionStore';

interface BalanceCardProps {
  balance: string;
  onBalanceChange?: (newBalance: number) => void;
}

// Create a variable to store balance, initialized from localStorage
let globalBalance = loadGlobalBalance();

export const getGlobalBalance = () => globalBalance;
export const setGlobalBalance = (newBalance: number) => {
  globalBalance = newBalance;
  saveGlobalBalance(newBalance); // Save to localStorage
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
  const [senderName, setSenderName] = useState('');
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
    
    // Add to transaction history
    addTransaction(
      senderName || "Bank Transfer", 
      "bank@upi", 
      formatIndianCurrency(amount),
      'received'
    );
    
    // Show success message
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to your account`
    });
    
    // Reset state
    setAmountInput('');
    setSenderName('');
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
    
    // Add to transaction history
    addTransaction(
      "Bank Withdrawal", 
      "bank@upi", 
      formatIndianCurrency(amount),
      'sent'
    );
    
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
    setSenderName('');
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
            </div>
            <h3 className="font-bold text-xl mb-2 dark:text-white text-center">Add Money</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Enter amount to add to your PhonePe account</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Name (Optional)</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender name"
                className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-lg">₹</span>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-lg font-bold"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={processAddMoney}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Withdraw Money Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
            </div>
            <h3 className="font-bold text-xl mb-2 dark:text-white text-center">Withdraw Money</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Enter amount to withdraw from your PhonePe account</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-lg">₹</span>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-lg font-bold"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={processWithdraw}
                className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium"
              >
                Withdraw
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default BalanceCard;
