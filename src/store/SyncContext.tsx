
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTransactions, getContacts, loadGlobalBalance, TransactionData, Contact } from "./TransactionStore";
import { toast } from "sonner";

interface SyncContextType {
  isSyncing: boolean;
  lastSynced: Date | null;
  syncNow: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

const SyncContext = createContext<SyncContextType>({
  isSyncing: false,
  lastSynced: null,
  syncNow: async () => {},
  syncStatus: 'idle',
});

export const useSyncContext = () => useContext(SyncContext);

const SYNC_API_URL = "https://api.yourdomain.com/sync"; // This would be your actual API endpoint

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Listen for storage events across the app
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      // Throttle syncing to avoid too many requests
      if (!isSyncing) {
        syncData();
      }
    };

    // Add event listeners for all storage events
    window.addEventListener('storage:transactions', handleStorageChange);
    window.addEventListener('storage:contacts', handleStorageChange);
    window.addEventListener('storage:balance', handleStorageChange);

    // Auto sync on load
    const lastSyncTimeStr = localStorage.getItem('lastSyncTime');
    if (lastSyncTimeStr) {
      setLastSynced(new Date(lastSyncTimeStr));
    }

    // Sync data every 5 minutes if app is open
    const syncInterval = setInterval(() => {
      if (!isSyncing) {
        syncData();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('storage:transactions', handleStorageChange);
      window.removeEventListener('storage:contacts', handleStorageChange);
      window.removeEventListener('storage:balance', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, [isSyncing]);

  // Sync data with the server
  const syncData = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      // This is a simulation since we don't have a real API endpoint
      // In a real app, you would use the following code:
      
      /* 
      const transactions = getTransactions();
      const contacts = getContacts();
      const balance = loadGlobalBalance();
      
      // Make an API call to sync data
      const response = await fetch(SYNC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          transactions,
          contacts,
          balance,
          deviceId: localStorage.getItem('deviceId') || 'unknown',
          lastSynced
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync with server');
      }
      
      const data = await response.json();
      
      // Update local storage with server data if needed
      if (data.shouldUpdate) {
        // Update local data
      }
      */
      
      // For simulation, we'll just wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      setSyncStatus('success');
      
      // Show success toast only on manual sync
      if (isSyncing) {
        toast.success("Data synced successfully");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus('error');
      toast.error("Failed to sync data with server");
    } finally {
      setIsSyncing(false);
    }
  };

  const syncNow = async () => {
    toast.info("Syncing data with server...");
    await syncData();
  };

  return (
    <SyncContext.Provider value={{ isSyncing, lastSynced, syncNow, syncStatus }}>
      {children}
    </SyncContext.Provider>
  );
};
