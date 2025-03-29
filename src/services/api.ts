
// API service for handling server communication

// Use a mock API endpoint for development
// In production, you would replace this with your actual API endpoint
const API_BASE_URL = 'https://api.example.com'; 
const IS_MOCK_MODE = true; // Toggle this to true to enable mock mode

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define interface for sync data
interface SyncData {
  transactions?: any[];
  contacts?: any[];
  balance?: number;
  deviceId?: string;
  lastSynced?: Date | null | string;
}

// Mock data responses for offline development
const mockResponses = {
  transactions: [],
  contacts: [],
  balance: 0,
  lastSynced: new Date().toISOString()
};

// Generic fetch wrapper with error handling and mock support
async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // If in mock mode, return mock responses
  if (IS_MOCK_MODE) {
    console.log('🔄 Mock API mode enabled, simulating server response');
    
    // Extract request data for mock handling
    let requestData: SyncData = {};
    if (options.body) {
      try {
        requestData = JSON.parse(options.body as string) as SyncData;
      } catch (e) {
        // Silently ignore parsing errors
      }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Handle different endpoints with mock data
    if (endpoint === '/sync') {
      // For sync endpoint, just echo back the data that was sent
      // but mark everything as synced
      return { 
        success: true, 
        data: {
          transactions: requestData.transactions ?? mockResponses.transactions,
          contacts: requestData.contacts ?? mockResponses.contacts,
          balance: requestData.balance ?? mockResponses.balance,
          lastSynced: new Date().toISOString()
        } as T
      };
    }
    
    // Default mock response
    return { success: true, data: mockResponses as unknown as T };
  }
  
  // Real API implementation
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
  },
  
  // Check if we're in mock mode
  isMockMode: () => IS_MOCK_MODE
};
