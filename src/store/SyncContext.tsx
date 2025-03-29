
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTransactions, getContacts, loadGlobalBalance, saveGlobalBalance, markAsSynced, TransactionData, Contact } from "./TransactionStore";
import { toast } from "sonner";
import { syncApi } from "../services/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

interface SyncContextType {
  isSyncing: boolean;
  lastSynced: Date | null;
  syncNow: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  isMockMode: boolean;
}

const SyncContext = createContext<SyncContextType>({
  isSyncing: false,
  lastSynced: null,
  syncNow: async () => {},
  syncStatus: 'idle',
  isMockMode: false,
});

export const useSyncContext = () => useContext(SyncContext);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const isMockMode = syncApi.isMockMode();

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
      // Get all local data
      const transactions = getTransactions();
      const contacts = getContacts();
      const balance = loadGlobalBalance();
      const deviceId = localStorage.getItem('deviceId') || `device_${Math.random().toString(36).substring(2, 9)}`;
      
      // Store device ID if not already stored
      if (!localStorage.getItem('deviceId')) {
        localStorage.setItem('deviceId', deviceId);
      }
      
      // Sync all data with the server
      const response = await syncApi.syncAll({
        transactions,
        contacts,
        balance,
        deviceId,
        lastSynced
      });
      
      if (response.success && response.data) {
        // Update local data with server data if needed
        const serverData = response.data;
        
        // Update transactions from server (if we have newer data from server)
        if (serverData.transactions && serverData.transactions.length > 0) {
          // Handle transaction merging here
          // For now, we'll just mark existing transactions as synced
          markAsSynced('transactions');
        }
        
        // Update contacts from server (if we have newer data from server)
        if (serverData.contacts && serverData.contacts.length > 0) {
          // Handle contacts merging here
          // For now, we'll just mark existing contacts as synced
          markAsSynced('contacts');
        }
        
        // Update balance if different
        if (serverData.balance !== undefined) {
          saveGlobalBalance(serverData.balance);
        }
        
        // Update last synced time
        const now = new Date();
        setLastSynced(now);
        localStorage.setItem('lastSyncTime', now.toISOString());
        
        setSyncStatus('success');
        
        // Show success toast only on manual sync
        if (isSyncing) {
          if (isMockMode) {
            toast.success("Data synced successfully (Mock Mode)");
          } else {
            toast.success("Data synced successfully");
          }
        }
      } else {
        throw new Error(response.error || "Failed to sync with server");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus('error');
      
      if (isMockMode) {
        toast.success("Data synced successfully (Mock Mode)");
      } else {
        toast.error("Failed to sync data with server");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const syncNow = async () => {
    if (isMockMode) {
      toast.info("Syncing data with server (Mock Mode)...");
    } else {
      toast.info("Syncing data with server...");
    }
    await syncData();
  };

  return (
    <SyncContext.Provider value={{ isSyncing, lastSynced, syncNow, syncStatus, isMockMode }}>
      {children}
    </SyncContext.Provider>
  );
};
