
// API service for handling server communication

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API endpoint in production

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic fetch wrapper with error handling
async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Sync API endpoints
export const syncApi = {
  // Get latest transactions from server
  getTransactions: async () => {
    return fetchWithAuth<any[]>('/transactions');
  },
  
  // Push local transactions to server
  pushTransactions: async (transactions: any[]) => {
    return fetchWithAuth<{synced: boolean}>('/transactions/sync', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  },
  
  // Get latest contacts from server
  getContacts: async () => {
    return fetchWithAuth<any[]>('/contacts');
  },
  
  // Push local contacts to server
  pushContacts: async (contacts: any[]) => {
    return fetchWithAuth<{synced: boolean}>('/contacts/sync', {
      method: 'POST',
      body: JSON.stringify({ contacts }),
    });
  },
  
  // Sync balance
  syncBalance: async (balance: number) => {
    return fetchWithAuth<{balance: number}>('/balance/sync', {
      method: 'POST',
      body: JSON.stringify({ balance }),
    });
  },

  // Sync all data at once
  syncAll: async (data: { 
    transactions: any[], 
    contacts: any[], 
    balance: number,
    deviceId: string,
    lastSynced: Date | null 
  }) => {
    return fetchWithAuth<{
      transactions: any[],
      contacts: any[],
      balance: number,
      lastSynced: string
    }>('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
