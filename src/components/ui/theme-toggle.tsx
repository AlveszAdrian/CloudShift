"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hidratação inconsistente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efeito simplificado para alternar o tema
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button 
        className={`p-2 rounded-md opacity-0 ${className}`}
        aria-label="Alternar tema"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleToggleTheme}
      className={`p-2 rounded-md 
        ${theme === "dark" 
          ? "text-gray-400 hover:text-gray-100 hover:bg-blue-900/20" 
          : "text-gray-600 hover:text-gray-900 hover:bg-blue-100/50"
        }
        ${className}`
      }
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Alternar tema"
      title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <motion.div
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 30 }}
        key={theme}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
} 