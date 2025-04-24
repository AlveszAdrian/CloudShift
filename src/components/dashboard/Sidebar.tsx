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

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "recursos": true,
    "seguranca": true,
    "admin": true
  });
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isActive = (href: string) => {
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
    expanded: { width: "16rem", transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { width: "5rem", transition: { duration: 0.3, ease: "easeInOut" } }
  };
  
  const itemVariants = {
    hover: { 
      scale: 1.02, 
      backgroundColor: "rgba(99, 102, 241, 0.1)", 
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    expanded: { rotate: 90, transition: { duration: 0.3 } }
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item, index) => {
      const isItemActive = item.href ? isActive(item.href) : false;
      const hasChildren = item.children && item.children.length > 0;
      const groupKey = item.name.toLowerCase().replace(/\s+/g, '-');
      const isExpanded = hasChildren ? expandedGroups[groupKey] : false;

      return (
        <div key={`${item.name}-${index}-${level}`} className={level > 0 ? "ml-3" : ""}>
          {item.href ? (
            <motion.div
              whileHover={itemVariants.hover}
              whileTap={itemVariants.tap}
              initial={false}
            >
              <Link
                href={item.href}
                className={`flex items-center text-xs py-2 px-3 rounded-md transition-all duration-200 ${
                  isItemActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400"
                } ${level > 0 ? "mt-1" : "mt-0.5"} ${collapsed && level === 0 ? "justify-center" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <motion.span 
                  className={`${collapsed && level === 0 ? "mr-0" : "mr-2"} ${
                    isItemActive ? "text-white" : "text-indigo-600 dark:text-indigo-400"
                  }`}
                  animate={isItemActive ? { scale: [1, 1.2, 1], transition: { duration: 0.3 } } : {}}
                >
                  {item.icon}
                </motion.span>
                {(!collapsed || level > 0) && (
                  <span className={`truncate ${isItemActive ? "font-medium" : "font-normal"}`}>
                    {item.name}
                  </span>
                )}
              </Link>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => toggleGroup(groupKey)}
              className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-md transition-all duration-200 ${
                hasChildren && expandedGroups[groupKey]
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${level > 0 ? "mt-1" : "mt-0.5"} ${collapsed && level === 0 ? "justify-center" : ""}`}
              whileHover={itemVariants.hover}
              whileTap={itemVariants.tap}
            >
              <div className="flex items-center">
                <span className={`${collapsed && level === 0 ? "mr-0" : "mr-2"} text-indigo-600 dark:text-indigo-400`}>
                  {item.icon}
                </span>
                {(!collapsed || level > 0) && (
                  <span className="truncate font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                )}
              </div>
              {hasChildren && (!collapsed || level > 0) && (
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  animate={isExpanded ? "expanded" : "initial"}
                >
                  <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                </motion.div>
              )}
            </motion.button>
          )}

          {hasChildren && (!collapsed || level > 0) && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    transition: { 
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.2, delay: 0.1 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: { 
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.1 }
                    }
                  }}
                  className="overflow-hidden pl-1 border-l border-indigo-100 dark:border-indigo-900/30 ml-2 mt-1"
                >
                  {renderNavItems(item.children || [], level + 1)}
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
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md bg-indigo-50 dark:bg-slate-800 shadow-md text-gray-700 dark:text-gray-200 border border-indigo-100 dark:border-slate-700"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div
        initial={false}
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        className={`fixed top-0 left-0 bottom-0 z-50 ${
          mobileOpen ? "block" : "hidden lg:block"
        } overflow-y-auto bg-white dark:bg-slate-900 border-r border-indigo-200 dark:border-slate-700 shadow-xl shadow-indigo-200/10 dark:shadow-slate-900/30`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-indigo-100 dark:border-slate-800 bg-indigo-50 dark:bg-slate-800/50">
            <Link href="/dashboard" className="flex items-center space-x-2 w-full group">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
                  >
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                  <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-500 transition-all duration-300">CloudShift</span>
                </motion.div>
              )}
              {collapsed && (
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
                  className="mx-auto"
                >
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
              )}
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCollapsed(!collapsed)}
              className="lg:flex hidden items-center justify-center p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 hover:dark:bg-indigo-900/30 transition-colors"
              aria-label="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 bg-indigo-50/50 dark:bg-transparent">
            <ul className="space-y-2">
              {renderNavItems(navItems)}
            </ul>
          </nav>

          {/* Footer with user info and theme toggle */}
          <div className="p-4 border-t border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <motion.div 
                  className="flex items-center space-x-2 group"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md"
                    whileHover={{ scale: 1.1 }}
                  >
                    {user?.name && user.name[0].toUpperCase()}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ThemeToggle className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 p-2 rounded-lg border border-indigo-200 dark:border-slate-700 transition-colors" />
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="p-2 text-red-500 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 