"use client";

import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import AwsCredentialForm from "@/components/aws/AwsCredentialForm";
import AwsConnectionStatus from "@/components/dashboard/AwsConnectionStatus";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

export default function CredentialsPage() {
  const { credentials, isLoading, error } = useAwsCredentials();

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Credenciais AWS</h1>
        <p className="mt-2 text-gray-600">
          Gerencie suas credenciais AWS para monitorar seus recursos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Credenciais Cadastradas
            </h2>
            
            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <div className="mt-1">{error}</div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : credentials.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Você ainda não adicionou nenhuma credencial AWS.
              </div>
            ) : (
              <div className="space-y-4">
                {credentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{credential.name}</h3>
                        <p className="text-sm text-gray-500">Região: {credential.region}</p>
                        <p className="text-xs text-gray-400">
                          Adicionada em: {new Date((credential as any).createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">
                        Ativa
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          
          {credentials.length > 0 && (
            <AwsConnectionStatus />
          )}
        </div>
        
        <AwsCredentialForm />
      </div>
    </div>
  );
} 