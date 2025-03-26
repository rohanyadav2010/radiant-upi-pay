
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface ContactCardProps {
  name: string;
  upiId: string;
  imageUrl?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  name, 
  upiId, 
  imageUrl 
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
      className="card-subtle flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={handleContactClick}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3 text-blue-600 font-medium">
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
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-gray-500 text-xs">{upiId}</p>
      </div>
    </motion.div>
  );
};

export default ContactCard;
