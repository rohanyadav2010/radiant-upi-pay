
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone, Users } from 'lucide-react';
import ContactCard from './ContactCard';
import { Button } from './ui/button';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contact data
  const contacts = [
    { id: 1, name: 'Rahul Sharma', upiId: 'rahul@okaxis' },
    { id: 2, name: 'Priya Mehta', upiId: 'priya@okicici' },
    { id: 3, name: 'Vikram Singh', upiId: 'vikram@oksbi' },
    { id: 4, name: 'Neha Patel', upiId: 'neha@okhdfcbank' },
    { id: 5, name: 'Suresh Kumar', upiId: 'suresh@okicici' },
    { id: 6, name: 'Deepika Verma', upiId: 'deepika@okpnb' },
    { id: 7, name: 'Rajesh Gupta', upiId: 'rajesh@oksbi' }
  ];

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl p-5 m-4 w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center">
            <Users size={18} className="mr-2" /> Contacts
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 pr-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="overflow-y-auto flex-1 mb-4">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-2"
              >
                <ContactCard
                  name={contact.name}
                  upiId={contact.upiId}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No contacts found</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <Button variant="outline" className="w-full justify-center" onClick={onClose}>
            <Phone size={16} className="mr-2" /> Add new contact
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactsModal;
