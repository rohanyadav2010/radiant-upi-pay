
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Registration successful! Please check your email to verify your account.",
        });
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        navigate('/');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-5">
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {isSignUp 
                  ? "Sign up to start using PhonePe" 
                  : "Sign in to access your PhonePe account"}
              </p>
            </div>
            
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  isSignUp ? "Sign Up" : "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSignUp 
                  ? "Already have an account? " 
                  : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
