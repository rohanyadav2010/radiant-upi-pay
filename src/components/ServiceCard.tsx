
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface ServiceCardProps {
  title: string;
  icon: React.ReactElement; // Changed from React.ReactNode to React.ReactElement
  onClick: () => void;
  path?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon, onClick, path }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (path) {
      navigate(path);
    } else {
      // Show a toast with more detailed info instead of "Coming soon"
      toast({
        title: `${title} Service`,
        description: `You've selected the ${title} service. Processing your request...`,
        duration: 3000,
      });
      
      // Call the provided onClick function
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover-lift cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-2 text-purple-500 dark:text-purple-400">
        {icon}
      </div>
      <p className="text-xs font-medium text-center">{title}</p>
    </motion.div>
  );
};

export default ServiceCard;
