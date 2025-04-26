"use client";

import { useEffect, useState } from "react";
import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function AwsConnectionStatus() {
  const { selectedCredential } = useAwsCredentials();
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCredential) {
      checkConnection();
    } else {
      setIsLoading(false);
      setError("Nenhuma credencial selecionada");
    }
  }, [selectedCredential]);

  const checkConnection = async () => {
    if (!selectedCredential) return;

    setIsLoading(true);
    setError(null);

    try {
      // Testar a API AWS
      const response = await fetch(`/api/aws/credentialCheck/test?credentialId=${selectedCredential.id}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      setDiagnosticData(data);
    } catch (err) {
      console.error("Erro ao testar conexão AWS:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao testar conexão");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCredential) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>Nenhuma credencial AWS selecionada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Diagnóstico de Conexão AWS
        </h3>
        <button
          onClick={checkConnection}
          disabled={isLoading}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Verificando..." : "Verificar"}
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 flex items-start">
          <XCircle className="h-5 w-5 mr-2 text-red-500" />
          <div>
            <p className="font-medium">Erro na conexão</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : diagnosticData ? (
        <div className="space-y-4">
          <div className={`p-3 rounded-md ${diagnosticData.connected ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"} flex items-center`}>
            {diagnosticData.connected ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
            )}
            <span>
              {diagnosticData.connected
                ? "Conexão AWS estabelecida com sucesso"
                : "Falha na conexão AWS"}
            </span>
          </div>

          <div className="border dark:border-gray-700 rounded-md">
            <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Detalhes da Credencial</h4>
            </div>
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">ID da Credencial:</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono text-xs truncate">{selectedCredential.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedCredential.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Região:</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedCredential.region}</span>
              </div>
              {diagnosticData.accountId && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">ID da Conta AWS:</span>
                  <span className="text-gray-900 dark:text-gray-100">{diagnosticData.accountId}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`${diagnosticData.connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {diagnosticData.connected ? "Ativa" : "Com problemas"}
                </span>
              </div>
            </div>
          </div>

          {diagnosticData.services && (
            <div className="border dark:border-gray-700 rounded-md">
              <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Status dos Serviços</h4>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(diagnosticData.services).map(([service, status]: [string, any]) => (
                    <div key={service} className="flex items-center">
                      {status.connected ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                      )}
                      <span className="text-sm">
                        {service}: <span className={status.connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{status.connected ? "OK" : "Erro"}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {diagnosticData.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Detalhes do erro</h4>
              <p className="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">{diagnosticData.error}</p>
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          Clique em "Verificar" para testar a conexão AWS.
        </p>
      )}
    </div>
  );
}