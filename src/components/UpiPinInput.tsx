
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpiPinInputProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
}

const UpiPinInput: React.FC<UpiPinInputProps> = ({ onSubmit, onCancel }) => {
  const [pin, setPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && !pin[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      // Update the pin
      const newPin = pin.split('');
      newPin[index] = value;
      const updatedPin = newPin.join('');
      setPin(updatedPin);
      
      // Move to next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit when all 4 digits are entered
      if (value && index === 3) {
        const completePin = newPin.join('');
        if (completePin.length === 4) {
          setTimeout(() => handleSubmit(), 300);
        }
      }
    }
  };
  
  const handleSubmit = () => {
    if (pin.length === 4) {
      setIsLoading(true);
      
      // Add a delay to simulate verification
      setTimeout(() => {
        setShowSuccess(true);
        
        // Add a delay after showing success animation
        setTimeout(() => {
          onSubmit(pin);
          setIsLoading(false);
          setShowSuccess(false);
        }, 1000);
      }, 1500);
    }
  };
  
  // Focus the first input when the component mounts
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/30 dark:to-gray-800">
      <div className="flex items-center justify-center mb-4">
        <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
      </div>
      <h3 className="text-xl font-bold text-center mb-2 dark:text-white">Enter UPI PIN</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">Please enter your 4-digit UPI PIN</p>
      
      <div className="flex justify-center gap-3 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={pin[index] || ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center text-xl font-bold bg-white dark:bg-gray-700 border-2 border-purple-100 dark:border-purple-800 rounded-xl focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
              disabled={isLoading || showSuccess}
            />
            {pin[index] && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {showSuccess && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center items-center mb-6"
        >
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            PIN Verified
          </div>
        </motion.div>
      )}
      
      <div className="flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
          disabled={isLoading || showSuccess}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isLoading || showSuccess}
          className={`flex-1 py-3 px-4 rounded-xl font-medium ${
            pin.length === 4 && !isLoading && !showSuccess
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Verifying...
            </div>
          ) : showSuccess ? (
            <div className="flex items-center justify-center">
              Processing...
            </div>
          ) : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default UpiPinInput;
