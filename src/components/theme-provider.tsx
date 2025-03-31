
"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create a context to make useTheme accessible throughout the app
type ThemeProviderState = {
  theme: string | undefined
  setTheme: (theme: string) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: undefined,
  setTheme: () => null,
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Export the useTheme hook that's imported in the Settings.tsx file
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    // Use the next-themes useTheme directly when our context is not available
    const { useTheme } = require("next-themes")
    return useTheme()
  }
  
  return context
}
