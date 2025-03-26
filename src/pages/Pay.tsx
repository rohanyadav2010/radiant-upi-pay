
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X, CheckCircle2 } from 'lucide-react';
import ContactCard from '../components/ContactCard';

const Pay = () => {
  const [scanActive, setScanActive] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Mock contact data
  const contacts = [
    { id: 1, name: 'Rahul Sharma', upiId: 'rahul@okaxis' },
    { id: 2, name: 'Priya Mehta', upiId: 'priya@okicici' },
    { id: 3, name: 'Vikram Singh', upiId: 'vikram@oksbi' },
    { id: 4, name: 'Neha Patel', upiId: 'neha@okhdfcbank' },
    { id: 5, name: 'Suresh Kumar', upiId: 'suresh@okicici' }
  ];

  // Function to simulate payment process
  const processPayment = () => {
    if (!paymentAmount) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      // Reset after showing success
      setTimeout(() => {
        setPaymentComplete(false);
        setPaymentAmount('');
        setScanActive(false);
      }, 2000);
    }, 1500);
  };

  // Animation variants
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
        <h1 className="text-xl font-bold">Pay</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-6 mb-6 flex flex-col items-center"
      >
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-1">Quick Pay</h2>
          <p className="text-gray-500 text-sm">Scan or enter amount to pay</p>
        </div>

        <div className="w-full">
          <div className="relative mb-6">
            <input
              type="text"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full text-center text-4xl font-bold py-4 bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder="₹0"
            />
            <div className="absolute inset-0 pointer-events-none border-b border-gray-200 opacity-50"></div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setScanActive(true)}
            className="w-full btn-primary rounded-xl mb-3 flex items-center justify-center"
          >
            <Scan size={18} className="mr-2" /> Scan QR Code
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={processPayment}
            disabled={!paymentAmount || isProcessing}
            className={`w-full rounded-xl py-3 flex items-center justify-center font-medium transition-all ${
              !paymentAmount || isProcessing ? 'bg-gray-200 text-gray-400' : 'btn-secondary'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </motion.button>
        </div>
      </motion.div>

      <div className="mb-4">
        <h2 className="font-bold text-base mb-4">Frequent Contacts</h2>
        
        <div className="space-y-2">
          {contacts.map((contact, index) => (
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
          ))}
        </div>
      </div>

      {/* QR Scanner Modal */}
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

      {/* Payment Success Modal */}
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
