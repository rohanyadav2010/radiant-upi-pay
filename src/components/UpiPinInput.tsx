
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
    }
  };
  
  const handleSubmit = () => {
    if (pin.length === 4) {
      setIsLoading(true);
      // Add a delay to simulate processing
      setTimeout(() => {
        onSubmit(pin);
        setIsLoading(false);
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
              disabled={isLoading}
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
      
      <div className="flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isLoading}
          className={`flex-1 py-3 px-4 rounded-xl font-medium ${
            pin.length === 4 && !isLoading
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </div>
          ) : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default UpiPinInput;
