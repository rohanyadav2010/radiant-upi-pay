
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone, Users, Plus, Trash2 } from 'lucide-react';
import ContactCard from './ContactCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: number;
  name: string;
  upiId: string;
}

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', upiId: '' });
  const [editMode, setEditMode] = useState(false);
  
  // Mock contact data with local state
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Rahul Sharma', upiId: 'rahul@okaxis' },
    { id: 2, name: 'Priya Mehta', upiId: 'priya@okicici' },
    { id: 3, name: 'Vikram Singh', upiId: 'vikram@oksbi' },
    { id: 4, name: 'Neha Patel', upiId: 'neha@okhdfcbank' },
    { id: 5, name: 'Suresh Kumar', upiId: 'suresh@okicici' },
    { id: 6, name: 'Deepika Verma', upiId: 'deepika@okpnb' },
    { id: 7, name: 'Rajesh Gupta', upiId: 'rajesh@oksbi' }
  ]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContact.name || !newContact.upiId) {
      toast({
        title: "Error",
        description: "Please fill all the fields"
      });
      return;
    }
    
    if (!newContact.upiId.includes('@')) {
      toast({
        title: "Invalid UPI ID",
        description: "UPI ID must contain @ symbol"
      });
      return;
    }
    
    const newId = Math.max(0, ...contacts.map(c => c.id)) + 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: '', upiId: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Contact added successfully"
    });
  };
  
  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Success",
      description: "Contact removed"
    });
  };

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
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 m-4 w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center dark:text-white">
            <Users size={18} className="mr-2" /> Contacts
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setEditMode(!editMode);
                setShowAddForm(false);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {editMode ? "Done" : "Edit"}
            </button>
            <button onClick={onClose}>
              <X size={20} className="dark:text-white" />
            </button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 pr-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium dark:text-white">Add New Contact</h4>
                <button onClick={() => setShowAddForm(false)}>
                  <X size={16} className="dark:text-white" />
                </button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="dark:bg-gray-600 dark:text-white dark:border-gray-600"
                />
                <Input
                  placeholder="UPI ID (e.g. name@bank)"
                  value={newContact.upiId}
                  onChange={(e) => setNewContact({...newContact, upiId: e.target.value})}
                  className="dark:bg-gray-600 dark:text-white dark:border-gray-600"
                />
                <Button onClick={handleAddContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="overflow-y-auto flex-1 mb-4">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-2 flex items-center"
              >
                <div className="flex-1">
                  <ContactCard
                    name={contact.name}
                    upiId={contact.upiId}
                    showDelete={editMode}
                    onDelete={() => handleDeleteContact(contact.id)}
                  />
                </div>
                {editMode && (
                  <button 
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No contacts found</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 dark:border-gray-700">
          <Button 
            variant="outline"
            className="w-full justify-center dark:text-white dark:hover:bg-gray-700"
            onClick={() => {
              setShowAddForm(true);
              setEditMode(false);
            }}
          >
            <Plus size={16} className="mr-2" /> Add new contact
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactsModal;
