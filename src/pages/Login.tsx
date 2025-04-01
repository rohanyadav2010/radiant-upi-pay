
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, EyeOff, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'mobile' | 'password'>('mobile');
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mobileNumber.length !== 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }
    
    setStep('password');
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome back to PhonePe!",
      });
      
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div 
          className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <img src="/phonepe-logo.png" alt="PhonePe" className="h-12 mx-auto" />
              </motion.div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-2xl font-bold mb-2 dark:text-white"
              >
                Welcome to PhonePe
              </motion.h1>
              
              <motion.p 
                variants={itemVariants} 
                className="text-gray-600 dark:text-gray-300"
              >
                India's most loved payments app
              </motion.p>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {step === 'mobile' ? (
                <motion.form
                  key="mobile-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleMobileSubmit}
                >
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-l-lg px-3 border-y border-l border-gray-200 dark:border-gray-600">
                        <span className="text-gray-500 dark:text-gray-400">+91</span>
                      </div>
                      <Input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter your mobile number"
                        className="rounded-l-none focus-visible:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 text-base"
                    disabled={mobileNumber.length !== 10}
                  >
                    Continue
                  </Button>
                  
                  <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                    By continuing, you agree to our <a href="#" className="text-purple-600">Terms</a> & <a href="#" className="text-purple-600">Privacy Policy</a>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                >
                  <div className="flex items-center mb-6">
                    <button
                      type="button"
                      onClick={() => setStep('mobile')}
                      className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <p className="text-gray-600 dark:text-gray-300">
                      +91 {mobileNumber}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pr-10 focus-visible:ring-purple-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 text-base"
                    disabled={isLoading || !password}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          
          <motion.div 
            variants={containerVariants}
            className="bg-gray-50 dark:bg-gray-700/50 p-6 text-center"
          >
            <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300">
              Don't have an account? <a href="#" className="font-medium text-purple-600">Sign Up</a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
