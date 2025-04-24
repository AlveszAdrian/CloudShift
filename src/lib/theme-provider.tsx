"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "cloudshift-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Primeiro carregamento - obter tema do localStorage ou usar light
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (savedTheme) {
      console.log("Tema carregado do localStorage:", savedTheme);
      setTheme(savedTheme);
    } else {
      // Usar light como padrão
      console.log("Tema definido como light (padrão)");
      setTheme("light");
      // Salvar o tema padrão no localStorage para garantir consistência
      localStorage.setItem(storageKey, "light");
    }
  }, [storageKey]);

  // Aplicar classe do tema apenas quando o tema mudar
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remover ambas as classes e adicionar a atual
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Aplicar também ao body
    body.classList.remove("light", "dark");
    body.classList.add(theme);
    
    // Aplicar estilos inline para garantir a mudança visual imediata
    if (theme === 'dark') {
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f8fafc';
      root.style.backgroundColor = '#0f172a';
    } else {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#171717';
      root.style.backgroundColor = '#ffffff';
    }
    
    console.log("Tema aplicado ao documento:", theme, "classes atuais:", root.classList.toString());
    
    // Salvar a preferência de tema no localStorage
    localStorage.setItem(storageKey, theme);
    console.log("Tema salvo no localStorage:", theme);
  }, [theme, storageKey, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Alternando tema de", theme, "para", newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  // Render com tema inicial para SSR, depois atualiza no cliente
  // Isso evita flash de conteúdo incorreto
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={{ ...initialState, theme: defaultTheme }} {...props}>
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook para acesso ao contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  
  return context;
}; 