
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  onClick,
  disabled = false 
}) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (disabled) {
      toast({
        title: "Feature coming soon",
        description: "This feature is currently under development."
      });
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={`flex flex-col items-center ${disabled ? 'opacity-70' : ''}`}
      onClick={handleClick}
    >
      <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2 transition-all hover:shadow-md">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </motion.button>
  );
};

export default ActionButton;
