"use client";

import { useState, useEffect } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";

export default function AwsConnectionStatus() {
  const { selectedCredential } = useAwsCredentials();
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiagnostics() {
      if (!selectedCredential) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/aws/debug");
        if (!response.ok) {
          throw new Error(`Erro ao verificar status da conexão: ${response.status}`);
        }

        const data = await response.json();
        setDiagnosticData(data);
      } catch (error) {
        console.error("Erro ao buscar diagnóstico:", error);
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDiagnostics();
  }, [selectedCredential]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Status da Conexão AWS</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Status da Conexão AWS</h3>
        <div className="bg-red-50 p-3 rounded-md text-red-700">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!diagnosticData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Status da Conexão AWS</h3>
        <p className="text-gray-500">Selecione uma credencial para verificar o status.</p>
      </div>
    );
  }

  // Encontrar a credencial selecionada nos dados de diagnóstico
  const credInfo = selectedCredential 
    ? diagnosticData.credentials.find((c: any) => c.id === selectedCredential.id)
    : diagnosticData.credentials[0];

  if (!credInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Status da Conexão AWS</h3>
        <p className="text-gray-500">Informações de diagnóstico não disponíveis para esta credencial.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Status da Conexão AWS</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Credencial: <span className="font-medium">{credInfo.name}</span>
        </p>
        <p className="text-sm text-gray-600">
          Região: <span className="font-medium">{credInfo.region}</span>
        </p>
      </div>
      
      <div className="space-y-2">
        <div className={`p-2 rounded-md ${getStatusColor(credInfo.tests.ec2.status)}`}>
          <p className="text-sm font-medium">EC2: {credInfo.tests.ec2.message}</p>
          {credInfo.tests.ec2.code && (
            <p className="text-xs">{credInfo.tests.ec2.code}</p>
          )}
        </div>
        
        <div className={`p-2 rounded-md ${getStatusColor(credInfo.tests.s3.status)}`}>
          <p className="text-sm font-medium">S3: {credInfo.tests.s3.message}</p>
          {credInfo.tests.s3.code && (
            <p className="text-xs">{credInfo.tests.s3.code}</p>
          )}
        </div>
        
        <div className={`p-2 rounded-md ${getStatusColor(credInfo.tests.guardduty.status)}`}>
          <p className="text-sm font-medium">GuardDuty: {credInfo.tests.guardduty.message}</p>
          {credInfo.tests.guardduty.code && (
            <p className="text-xs">{credInfo.tests.guardduty.code}</p>
          )}
        </div>
      </div>
      
      {diagnosticData.recommendation && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-800">{diagnosticData.recommendation}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>SDK v{diagnosticData.system.aws_sdk_version} | {new Date(diagnosticData.system.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}