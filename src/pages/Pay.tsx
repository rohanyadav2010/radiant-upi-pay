
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X, CheckCircle2, Moon, Sun, Plus, User } from 'lucide-react';
import ContactCard from '../components/ContactCard';
import UpiPinInput from '../components/UpiPinInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addTransaction, getContacts } from '@/store/TransactionStore';

const Pay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [scanActive, setScanActive] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<{name: string, upiId: string} | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [directUpiInput, setDirectUpiInput] = useState('');
  const [directNameInput, setDirectNameInput] = useState('');
  const [contacts, setContacts] = useState<{id: number, name: string, upiId: string}[]>([]);

  useEffect(() => {
    // Load contacts from store
    setContacts(getContacts());
    
    if (location.state?.contactName && location.state?.upiId) {
      setSelectedContact({
        name: location.state.contactName,
        upiId: location.state.upiId
      });
      
      toast({
        title: "Contact selected",
        description: `Ready to pay ${location.state.contactName}`
      });
    }
  }, [location.state]);

  const processPayment = () => {
    if (!paymentAmount) return;
    setShowPinInput(true);
  };

  const handlePinSubmit = (pin: string) => {
    setShowPinInput(false);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      if (selectedContact) {
        // Save transaction with selected contact
        addTransaction(
          selectedContact.name, 
          selectedContact.upiId, 
          paymentAmount
        );
      } else if (showDirectInput && directUpiInput) {
        // Save transaction with direct UPI input
        const name = directNameInput || directUpiInput;
        addTransaction(name, directUpiInput, paymentAmount);
      }
      
      setTimeout(() => {
        setPaymentComplete(false);
        setPaymentAmount('');
        setScanActive(false);
        setSelectedContact(null);
        setDirectUpiInput('');
        setDirectNameInput('');
        setShowDirectInput(false);
        // Refresh contacts after transaction
        setContacts(getContacts());
      }, 2000);
    }, 1500);
  };

  const handleDirectPay = () => {
    if (!directUpiInput || !directUpiInput.includes('@')) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID containing @"
      });
      return;
    }
    setShowPinInput(true);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const scannerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="section pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold dark:text-white">Pay</h1>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-6 mb-6 flex flex-col items-center"
      >
        {selectedContact ? (
          <div className="w-full mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium dark:text-white">{selectedContact.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedContact.upiId}</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSelectedContact(null)}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : showDirectInput ? (
          <div className="w-full mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium dark:text-white">Direct UPI Payment</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowDirectInput(false)}
              >
                <X size={18} />
              </button>
            </div>
            <Input 
              placeholder="UPI ID (e.g. name@bank)"
              value={directUpiInput}
              onChange={(e) => setDirectUpiInput(e.target.value)}
              className="dark:bg-gray-800"
            />
            <Input 
              placeholder="Recipient Name (optional)"
              value={directNameInput}
              onChange={(e) => setDirectNameInput(e.target.value)}
              className="dark:bg-gray-800"
            />
          </div>
        ) : (
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold mb-1 dark:text-white">Quick Pay</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Scan or enter amount to pay</p>
          </div>
        )}

        <div className="w-full">
          <div className="relative mb-6">
            <input
              type="text"
              value={paymentAmount}
              onChange={(e) => {
                // Only allow numbers and validate format
                const value = e.target.value.replace(/[^0-9]/g, '');
                setPaymentAmount(value ? `${value}` : '');
              }}
              className="w-full text-center text-4xl font-bold py-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors dark:text-white"
              placeholder="₹0"
            />
            <div className="absolute inset-0 pointer-events-none border-b border-gray-200 dark:border-gray-700 opacity-50"></div>
          </div>

          {!showDirectInput && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDirectInput(true)}
              className="w-full py-3 mb-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center"
            >
              <User size={18} className="mr-2" /> Pay by UPI ID
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setScanActive(true)}
            className="w-full btn-primary rounded-xl mb-3 flex items-center justify-center"
          >
            <Scan size={18} className="mr-2" /> Scan QR Code
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={showDirectInput ? handleDirectPay : processPayment}
            disabled={
              (!paymentAmount || isProcessing) || 
              (showDirectInput && !directUpiInput)
            }
            className={`w-full rounded-xl py-3 flex items-center justify-center font-medium transition-all ${
              (!paymentAmount || isProcessing) || (showDirectInput && !directUpiInput)
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
                : 'btn-secondary'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </motion.button>
        </div>
      </motion.div>

      <div className="mb-4">
        <h2 className="font-bold text-base mb-4 dark:text-white">Frequent Contacts</h2>
        
        <div className="space-y-2">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactCard
                  name={contact.name}
                  upiId={contact.upiId}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center py-3 text-gray-500 dark:text-gray-400">No contacts yet</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {scanActive && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setScanActive(false)}
          >
            <motion.div
              variants={scannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-5 m-4 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Scan QR Code</h3>
                <button onClick={() => setScanActive(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <p>Camera placeholder</p>
                  <p className="text-xs mt-2">Point your camera at a QR code</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                Position the QR code within the frame to scan
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPinInput && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              variants={scannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <UpiPinInput
                onSubmit={handlePinSubmit}
                onCancel={() => setShowPinInput(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paymentComplete && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              variants={scannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-5 m-4 w-full max-w-sm text-center"
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle2 size={60} className="text-green-500" />
                </motion.div>
              </div>
              
              <h3 className="font-bold text-xl mb-2">Payment Successful!</h3>
              <p className="text-gray-500 mb-4">
                Your payment of {paymentAmount} has been processed successfully.
                {selectedContact && ` to ${selectedContact.name}`}
              </p>
              
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPaymentComplete(false)}
                className="w-full btn-primary rounded-xl"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pay;
