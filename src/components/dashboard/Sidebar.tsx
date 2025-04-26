"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

interface SidebarProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "recursos": true,
    "seguranca": true,
    "admin": true
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notifica o componente pai quando o estado de colapso muda
  useEffect(() => {
    if (onToggleCollapse) {
      onToggleCollapse(collapsed);
    }
  }, [collapsed, onToggleCollapse]);

  // Reset expanded state on mobile toggle
  useEffect(() => {
    if (!mobileOpen) {
      // Wait for animation to complete
      const timer = setTimeout(() => {
        if (collapsed) {
          setExpandedGroups({});
        } else {
          setExpandedGroups({
            "recursos": true,
            "seguranca": true,
            "admin": true
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [collapsed, mobileOpen]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const isActive = (href: string | undefined) => {
    if (!href) return false;
    if (href === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return href !== '/dashboard' && pathname?.startsWith(href);
  };

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      )
    },
    {
      name: "Recursos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
      children: [
        {
          name: "Instâncias EC2",
          href: "/dashboard/ec2",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          )
        },
        {
          name: "Buckets S3",
          href: "/dashboard/s3",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          name: "Banco de Dados",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
              <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
              <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
            </svg>
          ),
          children: [
            {
              name: "RDS",
              href: "/dashboard/rds",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              )
            },
            {
              name: "DynamoDB",
              href: "/dashboard/dynamodb",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              )
            }
          ]
        },
        {
          name: "Redes VPC",
          href: "/dashboard/vpc",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          )
        }
      ]
    },
    {
      name: "IAM",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      children: [
        {
          name: "Usuários",
          href: "/dashboard/iam/advanced/users",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        },
        {
          name: "Grupos",
          href: "/dashboard/iam/advanced/groups",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        },
        {
          name: "Políticas",
          href: "/dashboard/iam/advanced/policies",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          )
        },
        {
          name: "Funções",
          href: "/dashboard/iam/advanced/roles",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              <path d="M15 7a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          )
        },
        {
          name: "Rotação de Chaves",
          href: "/dashboard/iam/advanced/credential-rotation",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          )
        }
      ]
    },
    {
      name: "Análise de Segurança",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
        </svg>
      ),
      children: [
        {
          name: "Visão Geral",
          href: "/dashboard/security",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          name: "Conformidade",
          href: "/dashboard/security/compliance",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          )
        }
      ]
    },
    {
      name: "Cloud SIEM",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
      href: "/dashboard/cloud-siem"
    },
    {
      name: "Administração",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      children: [
        {
          name: "Credenciais AWS",
          href: "/dashboard/credentials",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1v-1H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2zm-6-2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          name: "Relatórios",
          href: "/dashboard/reports",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          name: "Configurações",
          href: "/dashboard/settings",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          )
        }
      ]
    }
  ];

  // Animation variants
  const sidebarVariants = {
    expanded: { 
      width: "16rem", 
      transition: { 
        duration: 0.25, 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    },
    collapsed: { 
      width: "5rem", 
      transition: { 
        duration: 0.25, 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    }
  };
  
  const itemVariants = {
    hover: { 
      scale: 1.02, 
      backgroundColor: "rgba(59, 130, 246, 0.1)", 
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    expanded: { rotate: 90, transition: { duration: 0.3 } }
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const isItemActive = item.href ? isActive(item.href) : item.children && item.children.some(child => child.href && isActive(child.href));
      const hasChildren = item.children && item.children.length > 0;
      const isGroupExpanded = hasChildren && expandedGroups[item.name.toLowerCase()];
      const paddingLeft = level * 8 + (level === 0 ? 0 : 8); // Calculando o padding correto para subitens

      // Item principal
      const navItem = (
        <div className={`relative ${hasChildren ? 'group' : ''}`} key={item.name}>
          {item.href ? (
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={itemVariants}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center rounded-md px-3 py-2 text-sm font-medium w-full transition-all duration-200
                  ${isItemActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }
                `}
                style={{ paddingLeft: `${paddingLeft + 12}px` }}
              >
                <span className="flex items-center">
                  <motion.span 
                    className="mr-3"
                    animate={isItemActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  {(!collapsed || level > 0) && (
                    <motion.span
                      initial={collapsed && level === 0 ? { opacity: 0 } : { opacity: 1 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={itemVariants}
            >
              <button
                onClick={() => toggleGroup(item.name.toLowerCase())}
                className={`
                  flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium w-full transition-all duration-200
                  ${isItemActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }
                `}
                style={{ paddingLeft: `${paddingLeft + 12}px` }}
              >
                <span className="flex items-center">
                  <motion.span 
                    className="mr-3"
                    animate={isItemActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  {(!collapsed || level > 0) && (
                    <motion.span
                      initial={collapsed && level === 0 ? { opacity: 0 } : { opacity: 1 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </span>
                
                {hasChildren && !collapsed && (
                  <motion.span
                    animate={{ rotate: isGroupExpanded ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.span>
                )}
              </button>
            </motion.div>
          )}

          {/* Exibir subitens no hover quando collapsed */}
          {hasChildren && collapsed && level === 0 && item.children && (
            <motion.div 
              className="hidden group-hover:block absolute left-full top-0 ml-1 bg-white dark:bg-gray-900 shadow-lg rounded-md py-1 min-w-[180px] z-50 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {item.children.map((child) => (
                <motion.div
                  key={child.name}
                  whileHover="hover"
                  whileTap="tap"
                  variants={itemVariants}
                >
                  <Link
                    href={child.href || '#'}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium transition-all duration-200
                      ${child.href && isActive(child.href) 
                        ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <motion.span 
                      className="mr-3"
                      animate={child.href && isActive(child.href) ? { scale: 1.1 } : { scale: 1 }}
                    >
                      {child.icon}
                    </motion.span>
                    <span>{child.name}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      );

      // Retornar o item e seus filhos expandidos
      return (
        <div key={item.name} className="relative">
          {navItem}
          
          {/* Subitens expandidos (quando não está collapsed) */}
          {hasChildren && !collapsed && (
            <AnimatePresence>
              {isGroupExpanded && item.children && (
                <motion.div 
                  className="mt-1 space-y-1 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {renderNavItems(item.children, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Botão de toggle para mobile */}
      <motion.button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        onClick={() => setMobileOpen(!mobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="sr-only">Abrir menu</span>
        <AnimatePresence mode="wait" initial={false}>
          {mobileOpen ? (
            <motion.svg 
              key="close" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg 
              key="menu" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay para mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed lg:relative z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden"
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        initial={false}
        style={{
          width: mobileOpen ? "16rem" : (collapsed ? "5rem" : "16rem"),
          boxShadow: mobileOpen ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none",
          display: mobileOpen || mobileOpen === false ? "block" : "none" /* Mantem visivel em desktop */
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header/Logo */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeInOut",
                  repeat: 0,
                  repeatDelay: 7,
                  repeatType: "reverse"
                }}
              >
                <Shield size={collapsed ? 24 : 20} className="text-blue-600 dark:text-blue-400" />
              </motion.div>
              {!collapsed && (
                <motion.span 
                  className="font-semibold text-lg text-gray-800 dark:text-gray-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  CloudShift
                </motion.span>
              )}
            </Link>
            
            <motion.button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 hidden lg:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {renderNavItems(navItems)}
            </div>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <motion.div 
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user?.name || user?.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </div>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ThemeToggle />
              </motion.div>
              
              <motion.button
                onClick={() => logout()}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-md"
                title="Logout"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
} 