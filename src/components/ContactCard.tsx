
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';

interface ContactCardProps {
  name: string;
  upiId: string;
  imageUrl?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  name, 
  upiId, 
  imageUrl,
  showDelete = false,
  onDelete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactClick = () => {
    toast({
      title: "Contact selected",
      description: `Paying to ${name}`
    });
    
    // Navigate to payment page with pre-filled info
    navigate('/pay', { state: { contactName: name, upiId: upiId } });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="card-subtle flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
      onClick={handleContactClick}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-medium">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          name.charAt(0)
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm dark:text-white">{name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{upiId}</p>
      </div>
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ContactCard;
