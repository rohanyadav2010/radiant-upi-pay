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
