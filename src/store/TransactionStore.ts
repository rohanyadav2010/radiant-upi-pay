
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: any;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<any>;
  deleteTransaction: (id: string | number) => Promise<any>;
}

// Local storage keys
const BALANCE_KEY = 'phonepe_balance';
const TRANSACTIONS_KEY = 'transactions';
const CONTACTS_KEY = 'contacts';

// Initialize balance from localStorage or default to 10000
export const loadGlobalBalance = (): number => {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored ? parseInt(stored, 10) : 10000;
};

export const saveGlobalBalance = (balance: number): void => {
  localStorage.setItem(BALANCE_KEY, balance.toString());
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new CustomEvent('storage:balance'));
};

// Transaction functions that work with localStorage
export const addTransaction = (name: string, upiId: string, amount: string, type: 'sent' | 'received' = 'sent'): void => {
  const transactions = getTransactions();
  const newTransaction = {
    id: Date.now().toString(),
    name,
    upi_id: upiId,
    amount,
    type,
    date: new Date().toLocaleDateString(),
    created_at: new Date().toISOString(),
  };
  
  transactions.unshift(newTransaction);
  saveTransactions(transactions);
};

export const getTransactions = () => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTransactions = (transactions: any[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new CustomEvent('storage:transactions'));
};

// Contacts functions
export const getContacts = () => {
  const stored = localStorage.getItem(CONTACTS_KEY);
  return stored ? JSON.parse(stored) : [
    { id: 1, name: 'Rahul Kumar', upiId: 'rahul@okaxis' },
    { id: 2, name: 'Priya Sharma', upiId: 'priya@ybl' },
    { id: 3, name: 'Amit Singh', upiId: 'amit@okicici' },
  ];
};

export const saveContacts = (contacts: any[]) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new CustomEvent('storage:contacts'));
};

// Export Transaction type for use in other components
export type TransactionData = {
  id: string;
  name: string;
  amount: string;
  date: string;
  type: 'sent' | 'received';
};

const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  loading: false,
  error: null,
  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ transactions: data || [], loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  addTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        transactions: [data, ...state.transactions],
      }));

      return { success: true, message: "Transaction added successfully", data };
    } catch (error) {
      console.error("Error adding transaction:", error);
      return { success: false, message: "Failed to add transaction" };
    }
  },
  deleteTransaction: async (id: string | number) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id.toString()); // Convert id to string

      if (error) throw error;

      // Remove transaction from state after successful deletion
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      }));

      return { success: true, message: "Transaction deleted successfully" };
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return { success: false, message: "Failed to delete transaction" };
    }
  },
}));

export default useTransactionStore;
