import React from 'react';

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Um container padronizado para gráficos e visualizações de dados
 * que elimina efeitos de degradê e gradientes nas bordas
 */
const DashboardContainer: React.FC<DashboardContainerProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-4 clean-chart-container ${className}`}
      style={{ 
        overflow: 'hidden', // Garante que os conteúdos não ultrapassem as bordas
        position: 'relative'
      }}
    >
      {/* Este estilo inline é adicionado para garantir que nenhum efeito de degradê seja aplicado */}
      <style jsx>{`
        .clean-chart-container::before,
        .clean-chart-container::after {
          display: none !important;
          content: none !important;
          background: none !important;
        }
        
        .clean-chart-container :global(.recharts-wrapper::before),
        .clean-chart-container :global(.recharts-wrapper::after) {
          display: none !important;
          content: none !important;
          background: none !important;
        }
      `}</style>
      {children}
    </div>
  );
};

export default DashboardContainer; 