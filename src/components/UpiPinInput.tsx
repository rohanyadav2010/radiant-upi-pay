
import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-semibold">Enter UPI PIN</h2>
      <p className="text-sm text-gray-500 mb-4">Please enter your 4-digit UPI PIN to authorize this payment</p>
      
      <div className="relative w-full">
        <InputOTP
          maxLength={4}
          value={pin}
          onChange={(value) => setPin(value)}
          containerClassName="gap-2 mb-4"
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot 
                  key={index} 
                  {...slot} 
                  index={index} 
                  className="w-12 h-12"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500"
        >
          {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      <div className="flex gap-3 w-full mt-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1" 
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
