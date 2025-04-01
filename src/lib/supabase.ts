
// This is a mock implementation since we don't have an actual Supabase project
// In a real project, you would connect to your Supabase instance

const mockData = {
  transactions: [
    { 
      id: '1', 
      name: 'John Doe', 
      amount: '₹500', 
      date: '2023-06-15', 
      type: 'sent',
      created_at: '2023-06-15T10:30:00Z',
      upi_id: 'john@upi'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      amount: '₹1,200', 
      date: '2023-06-14', 
      type: 'received',
      created_at: '2023-06-14T14:20:00Z',
      upi_id: 'jane@upi'
    },
    { 
      id: '3', 
      name: 'Coffee Shop', 
      amount: '₹150', 
      date: '2023-06-13', 
      type: 'sent',
      created_at: '2023-06-13T08:45:00Z',
      upi_id: 'coffee@upi'
    }
  ]
};

// Mock Supabase client
export const supabase = {
  from: (table: string) => {
    return {
      select: (query: string = "*") => {
        return {
          order: (column: string, { ascending = true } = {}) => {
            const sortedData = [...mockData[table as keyof typeof mockData]].sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);
              return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            });
            
            return Promise.resolve({
              data: sortedData,
              error: null
            });
          }
        };
      },
      insert: (items: any[]) => {
        return {
          select: () => {
            return {
              single: () => {
                const newItem = {
                  ...items[0],
                  id: (mockData.transactions.length + 1).toString(),
                  created_at: new Date().toISOString()
                };
                
                mockData.transactions.unshift(newItem);
                
                return Promise.resolve({
                  data: newItem,
                  error: null
                });
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: string) => {
            const index = mockData.transactions.findIndex(item => item.id === value);
            
            if (index !== -1) {
              mockData.transactions.splice(index, 1);
            }
            
            return Promise.resolve({
              error: null
            });
          }
        };
      }
    };
  }
};
