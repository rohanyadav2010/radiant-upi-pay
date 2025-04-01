
export interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  type: 'sent' | 'received';
  created_at: string;
  upi_id: string;
}

export interface Contact {
  id: number;
  name: string;
  upiId: string;
}
