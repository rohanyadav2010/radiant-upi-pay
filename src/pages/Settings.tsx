
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, BellRing, LogOut, User, Shield, CreditCard } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Log out user
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="section pt-8">
      <h1 className="text-xl font-bold mb-6 dark:text-white">Settings</h1>
      
      <div className="space-y-4">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <SettingsItem
            icon={theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            title="Dark Mode"
            description="Switch between light and dark mode"
            control={
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme} 
              />
            }
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4"
        >
          <SettingsItem
            icon={<BellRing size={18} />}
            title="Notifications"
            description="Get alerts for transactions"
            control={<Switch defaultChecked />}
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-subtle rounded-xl"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Account</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <SettingsLink 
              icon={<User size={18} />}
              title="Profile Information"
              onClick={() => {}}
            />
            <SettingsLink 
              icon={<Shield size={18} />}
              title="Security"
              onClick={() => {}}
            />
            <SettingsLink 
              icon={<CreditCard size={18} />}
              title="Payment Methods"
              onClick={() => {}}
            />
            <SettingsLink 
              icon={<LogOut size={18} />}
              title="Log Out"
              onClick={handleLogout}
              textColor="text-red-500"
            />
          </div>
        </motion.div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PhonePe Clone v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  control: React.ReactNode;
}

const SettingsItem = ({ icon, title, description, control }: SettingsItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <div>
        <p className="font-medium dark:text-white">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{description}</p>
      </div>
    </div>
    {control}
  </div>
);

interface SettingsLinkProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  textColor?: string;
}

const SettingsLink = ({ icon, title, onClick, textColor = 'dark:text-white' }: SettingsLinkProps) => (
  <button
    className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <p className={`font-medium ${textColor}`}>{title}</p>
    </div>
  </button>
);

export default Settings;
