"use client";

import { useEffect } from "react";

const ThemeScript = () => {
  useEffect(() => {
    console.log("Script de inicialização de tema executado no cliente");
    
    // Função para aplicar o tema uma vez
    const applyTheme = () => {
      const theme = localStorage.getItem("cloudshift-theme") || "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(theme);
      console.log("Tema aplicado no cliente:", theme);
      
      // Aplicar estilos baseados no tema
      if (theme === 'dark') {
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f8fafc';
        document.documentElement.style.backgroundColor = '#0f172a';
      } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#171717';
        document.documentElement.style.backgroundColor = '#ffffff';
      }
    };
    
    // Aplicar tema depois de um curto período para garantir que tudo está carregado
    setTimeout(applyTheme, 100);
    
  }, []);

  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Obter o tema do localStorage ou usar o padrão light
              var storedTheme = localStorage.getItem('cloudshift-theme');
              var theme = storedTheme || "light";
              
              // Aplicar o tema imediatamente para evitar flash
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(theme);
              document.body.classList.remove('light', 'dark');
              document.body.classList.add(theme);
              
              // Forçar atualização das classes de tema em componentes
              if (theme === 'dark') {
                document.body.style.backgroundColor = '#0f172a';
                document.body.style.color = '#f8fafc';
                document.documentElement.style.backgroundColor = '#0f172a';
              } else {
                document.body.style.backgroundColor = '#ffffff';
                document.body.style.color = '#171717';
                document.documentElement.style.backgroundColor = '#ffffff';
              }
              
              // Adicionar listener para alterações de tema
              window.addEventListener('storage', function(e) {
                if (e.key === 'cloudshift-theme') {
                  var newTheme = e.newValue || "light";
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(newTheme);
                  document.body.classList.remove('light', 'dark');
                  document.body.classList.add(newTheme);
                  
                  if (newTheme === 'dark') {
                    document.body.style.backgroundColor = '#0f172a';
                    document.body.style.color = '#f8fafc';
                    document.documentElement.style.backgroundColor = '#0f172a';
                  } else {
                    document.body.style.backgroundColor = '#ffffff';
                    document.body.style.color = '#171717';
                    document.documentElement.style.backgroundColor = '#ffffff';
                  }
                  
                  console.log('Tema atualizado via storage:', newTheme);
                }
              });
              
              console.log('Tema inicial aplicado:', theme);
            } catch (e) {
              console.error('Erro ao aplicar tema inicial:', e);
            }
          })();
        `,
      }}
    />
  );
};

export default ThemeScript; 