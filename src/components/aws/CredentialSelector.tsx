"use client";

import { useAwsCredentials } from "@/hooks/useAwsCredentials";
import { useRouter } from "next/navigation";

export default function CredentialSelector() {
  const { credentials, selectedCredential, selectCredential, loading } = useAwsCredentials();
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center space-x-2">
        <span className="text-gray-700">Carregando credenciais...</span>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Nenhuma credencial AWS encontrada</span>
          <button
            onClick={() => router.push("/dashboard/credentials")}
            className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Adicionar Credencial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="credential-selector" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">
          Selecionar Credencial AWS:
        </label>
        <div className="flex-1 sm:ml-4 max-w-md">
          <select
            id="credential-selector"
            value={selectedCredential?.id || ""}
            onChange={(e) => selectCredential(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Selecione uma credencial
            </option>
            {credentials.map((cred) => (
              <option key={cred.id} value={cred.id}>
                {cred.name} ({cred.region})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 