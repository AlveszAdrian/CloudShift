"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun } from "lucide-react";

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

  // Adiciona um log para depuração do tema atual
  useEffect(() => {
    if (mounted) {
      console.log("Tema atual:", theme);
    }
  }, [theme, mounted]);

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Alternando de tema:", theme, "para", newTheme);
    
    // Aplicar o tema diretamente aos elementos HTML para evitar atrasos
    const root = document.documentElement;
    const body = document.body;
    
    // Remover ambas as classes e adicionar a atual
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    
    // Aplicar também ao body
    body.classList.remove("light", "dark");
    body.classList.add(newTheme);
    
    // Aplicar estilos inline para garantir a mudança visual imediata
    if (newTheme === 'dark') {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
      document.documentElement.style.backgroundColor = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#171717';
      document.documentElement.style.backgroundColor = '#ffffff';
    }
    
    // Salvar a preferência diretamente no localStorage
    localStorage.setItem("cloudshift-theme", newTheme);
    
    // Atualizar o estado do tema no contexto
    setTheme(newTheme);
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
    <button
      onClick={handleToggleTheme}
      className={`p-2 rounded-md transition-colors hover:bg-accent ${
        theme === "dark" 
          ? "text-yellow-300 hover:text-yellow-400" 
          : "text-slate-800 hover:text-slate-900"
      } ${className}`}
      aria-label="Alternar tema"
      title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
} 