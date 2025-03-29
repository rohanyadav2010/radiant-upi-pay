
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { SyncProvider } from "./store/SyncContext";

// Import pages
import Home from "./pages/Home";
import Pay from "./pages/Pay";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Import layout
import AppLayout from "./components/AppLayout";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SyncProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/pay" element={<Pay />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </SyncProvider>
  </QueryClientProvider>
);

export default App;
