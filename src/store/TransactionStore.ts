// Updated store pattern with Supabase integration
import { supabase, TransactionRecord, ContactRecord, BalanceRecord, getCurrentUserId } from '../services/supabase';

export interface TransactionData {
  id: number | string;
  name: string;
  upiId: string;
  amount: string;
  date: string;
  type: 'sent' | 'received';
}

export interface Contact {
  id: number | string;
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

// Fallback to localStorage when offline or when user is not logged in
const loadFromLocalStorage = (key: string, defaultValue: any): any => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event(`storage:${key}`));
};

// Load transactions with Supabase fallback
export const getTransactions = async (): Promise<TransactionData[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return loadFromLocalStorage('transactions', []);
  }
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions:', error);
      return loadFromLocalStorage('transactions', []);
    }
    
    const mappedData = data.map((item) => ({
      id: item.id,
      name: item.name,
      upiId: item.upi_id,
      amount: item.amount_formatted,
      date: item.date,
      type: item.type as "sent" | "received"
    }));
    
    return mappedData;
  } catch (err) {
    console.error('Error in getTransactions:', err);
    return loadFromLocalStorage('transactions', []);
  }
};

// Load contacts with Supabase fallback
export const getContacts = async (): Promise<Contact[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return loadFromLocalStorage('contacts', []);
  }
  
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching contacts:', error);
      return loadFromLocalStorage('contacts', []);
    }
    
    return data.map((record: ContactRecord) => ({
      id: record.id || record.created_at || Date.now(),
      name: record.name,
      upiId: record.upi_id,
      lastTransaction: record.last_transaction
    }));
  } catch (err) {
    console.error('Error in getContacts:', err);
    return loadFromLocalStorage('contacts', []);
  }
};

// Get global balance
export const loadGlobalBalance = async (): Promise<number> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    const stored = localStorage.getItem('globalBalance');
    return stored ? parseInt(stored) : 225925;
  }
  
  try {
    const { data, error } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching balance:', error);
      const stored = localStorage.getItem('globalBalance');
      return stored ? parseInt(stored) : 225925;
    }
    
    return data.balance;
  } catch (err) {
    console.error('Error in loadGlobalBalance:', err);
    const stored = localStorage.getItem('globalBalance');
    return stored ? parseInt(stored) : 225925;
  }
};

// Save global balance
export const saveGlobalBalance = async (balance: number): Promise<void> => {
  localStorage.setItem('globalBalance', balance.toString());
  window.dispatchEvent(new Event('storage:balance'));
  
  const userId = await getCurrentUserId();
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('balances')
      .upsert({ 
        user_id: userId, 
        balance,
        updated_at: new Date().toISOString() 
      }, { 
        onConflict: 'user_id' 
      });
      
    if (error) {
      console.error('Error saving balance:', error);
    }
  } catch (err) {
    console.error('Error in saveGlobalBalance:', err);
  }
};

// Add or update a contact
export const addOrUpdateContact = async (name: string, upiId: string): Promise<void> => {
  const contacts = loadFromLocalStorage('contacts', []);
  const existingContactIndex = contacts.findIndex((c: Contact) => c.upiId === upiId);
  
  if (existingContactIndex >= 0) {
    contacts[existingContactIndex].lastTransaction = getFormattedDate();
  } else {
    contacts.push({
      id: Date.now(),
      name,
      upiId,
      lastTransaction: getFormattedDate()
    });
  }
  
  saveToLocalStorage('contacts', contacts);
  
  const userId = await getCurrentUserId();
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('contacts')
      .upsert({ 
        user_id: userId, 
        name, 
        upi_id: upiId,
        last_transaction: getFormattedDate(),
        updated_at: new Date().toISOString() 
      }, { 
        onConflict: 'user_id, upi_id' 
      });
      
    if (error) {
      console.error('Error saving contact:', error);
    }
  } catch (err) {
    console.error('Error in addOrUpdateContact:', err);
  }
};

// Add a new transaction
export const addTransaction = async (
  name: string,
  upiId: string,
  amount: string,
  type: 'sent' | 'received' = 'sent'
): Promise<void> => {
  const formattedAmount = amount.startsWith('₹') ? amount : `₹${amount}`;
  const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''));
  
  const transactions = loadFromLocalStorage('transactions', []);
  const newTransaction: TransactionData = {
    id: Date.now(),
    name,
    upiId,
    amount: formattedAmount,
    date: getFormattedDate(),
    type
  };
  
  transactions.unshift(newTransaction);
  saveToLocalStorage('transactions', transactions);
  
  await addOrUpdateContact(name, upiId);
  
  const userId = await getCurrentUserId();
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({ 
        user_id: userId, 
        name, 
        upi_id: upiId,
        amount: numericAmount,
        amount_formatted: formattedAmount,
        date: getFormattedDate(),
        type
      });
      
    if (error) {
      console.error('Error saving transaction:', error);
    }
  } catch (err) {
    console.error('Error in addTransaction:', err);
  }
};

// Remove a contact
export const removeContact = async (id: number | string): Promise<void> => {
  const contacts = loadFromLocalStorage('contacts', []);
  const newContacts = contacts.filter((contact: Contact) => contact.id !== id);
  saveToLocalStorage('contacts', newContacts);
  
  const userId = await getCurrentUserId();
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error removing contact:', error);
    }
  } catch (err) {
    console.error('Error in removeContact:', err);
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string | number): Promise<void> => {
  const transactionId = id.toString();
  
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
      
    if (error) {
      console.error('Error deleting transaction:', error);
    }
  } catch (err) {
    console.error('Error in deleteTransaction:', err);
  }
};
