
import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface UpiPinInputProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
}

const UpiPinInput: React.FC<UpiPinInputProps> = ({ onSubmit, onCancel }) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  
  const handleSubmit = () => {
    if (pin.length === 4) {
      onSubmit(pin);
    }
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
        <ShieldCheck size={28} className="text-blue-600 dark:text-blue-400" />
      </div>
      
      <h2 className="text-xl font-semibold dark:text-white">Enter UPI PIN</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        Please enter your 4-digit UPI PIN to authorize this payment
      </p>
      
      <div className="relative w-full mb-6">
        <InputOTP
          maxLength={4}
          value={pin}
          onChange={(value) => setPin(value)}
          containerClassName="gap-3 mb-4 justify-center"
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot 
                  key={index} 
                  {...slot} 
                  index={index} 
                  className="w-14 h-14 text-xl font-bold border-2 dark:bg-gray-700 dark:border-gray-600"
                >
                  {showPin ? slot.char : slot.char ? '•' : ''}
                </InputOTPSlot>
              ))}
            </InputOTPGroup>
          )}
        />
        
        <button 
          type="button"
          onClick={togglePinVisibility}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400"
        >
          {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="flex gap-3 w-full mt-2">
        <Button 
          variant="outline" 
          className="flex-1 h-12 text-base dark:border-gray-600" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 h-12 text-base bg-blue-500 hover:bg-blue-600" 
          onClick={handleSubmit}
          disabled={pin.length !== 4}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default UpiPinInput;
