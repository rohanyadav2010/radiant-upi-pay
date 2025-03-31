
// We'll use a simple store pattern with localStorage for persistence

export interface TransactionData {
  id: number;
  name: string;
  upiId: string;
  amount: string;
  date: string;
  type: 'sent' | 'received';
}

export interface Contact {
  id: number;
  name: string;
  upiId: string;
  lastTransaction?: string;
}

// Helper to get a formatted date string
const getFormattedDate = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12) || 12;
  
  return `Today, ${displayHours}:${minutes} ${ampm}`;
};

// Load transactions from localStorage
const loadTransactions = (): TransactionData[] => {
  const stored = localStorage.getItem('transactions');
  return stored ? JSON.parse(stored) : [];
};

// Save transactions to localStorage
const saveTransactions = (transactions: TransactionData[]): void => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  // Dispatch an event to notify other components
  window.dispatchEvent(new Event('storage:transactions'));
};

// Load contacts from localStorage
const loadContacts = (): Contact[] => {
  const stored = localStorage.getItem('contacts');
  return stored ? JSON.parse(stored) : [];
};

// Save contacts to localStorage
const saveContacts = (contacts: Contact[]): void => {
  localStorage.setItem('contacts', JSON.stringify(contacts));
  // Dispatch an event to notify other components
  window.dispatchEvent(new Event('storage:contacts'));
};

// Save global balance to localStorage
export const saveGlobalBalance = (balance: number): void => {
  localStorage.setItem('globalBalance', balance.toString());
  // Dispatch an event to notify other components
  window.dispatchEvent(new Event('storage:balance'));
};

// Load global balance from localStorage
export const loadGlobalBalance = (): number => {
  const stored = localStorage.getItem('globalBalance');
  return stored ? parseInt(stored) : 225925; // Default balance
};

// Add a new transaction
export const addTransaction = (
  name: string,
  upiId: string,
  amount: string,
  type: 'sent' | 'received' = 'sent'
): void => {
  const transactions = loadTransactions();
  const newTransaction: TransactionData = {
    id: Date.now(),
    name,
    upiId,
    amount: amount.startsWith('₹') ? amount : `₹${amount}`,
    date: getFormattedDate(),
    type
  };
  
  transactions.unshift(newTransaction); // Add to beginning of array
  saveTransactions(transactions);
  
  // Also update or add contact
  addOrUpdateContact(name, upiId);
};

// Add or update a contact
export const addOrUpdateContact = (name: string, upiId: string): void => {
  const contacts = loadContacts();
  const existingContactIndex = contacts.findIndex(c => c.upiId === upiId);
  
  if (existingContactIndex >= 0) {
    // Update existing contact
    contacts[existingContactIndex].lastTransaction = getFormattedDate();
  } else {
    // Add new contact
    contacts.push({
      id: Date.now(),
      name,
      upiId,
      lastTransaction: getFormattedDate()
    });
  }
  
  saveContacts(contacts);
};

// Remove a contact
export const removeContact = (id: number): void => {
  const contacts = loadContacts();
  const newContacts = contacts.filter(contact => contact.id !== id);
  saveContacts(newContacts);
};

// Get all transactions
export const getTransactions = (): TransactionData[] => {
  return loadTransactions();
};

// Get all contacts
export const getContacts = (): Contact[] => {
  return loadContacts();
};
