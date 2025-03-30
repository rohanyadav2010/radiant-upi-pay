
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-9 h-9 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-sm"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div 
              key={theme === "light" ? "light-icon" : "dark-icon"}
              initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {theme === "light" ? 
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" /> : 
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-300" />
              }
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl overflow-hidden border border-gray-100/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50/90 dark:hover:bg-gray-800/90"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50/90 dark:hover:bg-gray-800/90"
        >
          <Moon className="h-4 w-4 text-blue-300" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50/90 dark:hover:bg-gray-800/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-computer">
            <rect width="14" height="8" x="5" y="2" rx="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" />
            <path d="M6 18h2" />
            <path d="M12 18h6" />
          </svg>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
