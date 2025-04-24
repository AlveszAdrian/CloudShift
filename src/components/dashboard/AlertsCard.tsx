"use client";

import Link from "next/link";
import { useAlerts } from "@/hooks/useAlerts";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AlertsCard() {
  const { alerts, loading, error, fetchAlerts } = useAlerts();
  
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  
  // Filtrar apenas alertas ativos
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  
  // Agrupar alertas por severidade
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'CRITICAL');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'HIGH');
  const mediumAlerts = activeAlerts.filter(alert => alert.severity === 'MEDIUM');
  const lowAlerts = activeAlerts.filter(alert => alert.severity === 'LOW');
  
  const getColorBySeverity = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Alertas de Segurança</h2>
        <Link
          href="/dashboard/security"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Ver todos
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : activeAlerts.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Nenhum alerta de segurança ativo.
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{criticalAlerts.length}</div>
              <div className="text-xs text-red-600">Críticos</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">{highAlerts.length}</div>
              <div className="text-xs text-orange-600">Altos</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-700">{mediumAlerts.length}</div>
              <div className="text-xs text-yellow-600">Médios</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">{lowAlerts.length}</div>
              <div className="text-xs text-blue-600">Baixos</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {activeAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${getColorBySeverity(alert.severity)} mr-3`}></div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {alert.resourceType}: {alert.resourceId}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
} 