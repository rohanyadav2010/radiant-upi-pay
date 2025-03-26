
import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center"
      onClick={onClick}
    >
      <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </motion.button>
  );
};

export default ActionButton;
