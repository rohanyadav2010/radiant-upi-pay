
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover-lift cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2 text-blue-500 dark:text-blue-400">
        {icon}
      </div>
      <p className="text-xs font-medium text-center">{title}</p>
    </motion.div>
  );
};

export default ServiceCard;
