
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Types for our database tables
export interface TransactionRecord {
  id?: string;
  user_id: string;
  name: string;
  upi_id: string;
  amount: number;
  amount_formatted: string;
  date: string;
  type: 'sent' | 'received';
  created_at?: string;
}

export interface ContactRecord {
  id?: string;
  user_id: string;
  name: string;
  upi_id: string;
  last_transaction?: string;
  created_at?: string;
}

export interface BalanceRecord {
  id?: string;
  user_id: string;
  balance: number;
  updated_at?: string;
}

// Export the supabase client from our integration
export const supabase = supabaseClient;

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return null;
  }
  return data.session.user.id;
};
