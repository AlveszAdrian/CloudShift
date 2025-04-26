"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Função para ser chamada pelo Sidebar quando seu estado mudar
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar com função de callback para sinalizar mudanças de estado */}
      <Sidebar onToggleCollapse={handleSidebarToggle} />
      
      {/* Conteúdo principal com transição suave quando a sidebar muda */}
      <motion.main 
        className="flex-1 overflow-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.2,
          // Adicionando transição específica para ajustar a largura suavemente
          layout: { duration: 0.15 } 
        }}
        // Usando layout para detectar automaticamente mudanças de layout
        layout
      >
        {/* Container para o conteúdo da página com altura mínima definida */}
        <div className="min-h-screen px-4 py-4 lg:px-6 lg:py-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
} 