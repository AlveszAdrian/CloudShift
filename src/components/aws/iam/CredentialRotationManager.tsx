import { useState, useEffect } from "react";
import { 
  RotateCw, 
  Key, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  RefreshCw, 
  Clock,
  Shield,
  ShieldAlert,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

interface UserAccessKey {
  userName: string;
  accessKeyId: string;
  status: string;
  createDate: string;
  lastRotated?: string;
  daysOld: number;
}

interface RotationManagerProps {
  credentialId: string;
  onUpdate?: () => void;
}

export default function CredentialRotationManager({ credentialId, onUpdate }: RotationManagerProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [accessKeys, setAccessKeys] = useState<UserAccessKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<{[key: string]: boolean}>({});
  const [rotationInProgress, setRotationInProgress] = useState(false);
  const [rotationResults, setRotationResults] = useState<{
    success: {userName: string, accessKey: any}[];
    failed: {userName: string, error: string}[];
  }>({
    success: [],
    failed: []
  });
  
  // Buscar usuários e chaves ao carregar o componente
  useEffect(() => {
    if (credentialId) {
      fetchUsers();
    }
  }, [credentialId]);
  
  // Limpar mensagens após alguns segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const fetchUsers = async () => {
    if (!credentialId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/aws/iam/users?credentialId=${encodeURIComponent(credentialId)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar usuários IAM');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      
      // Buscar chaves de acesso para cada usuário
      const keysPromises = (data.users || []).map(async (user: any) => {
        if (user.accessKeysCount === 0) return [];
        
        const keyResponse = await fetch(
          `/api/aws/iam/users/access-keys?userName=${encodeURIComponent(user.userName)}&credentialId=${encodeURIComponent(credentialId)}`
        );
        
        if (!keyResponse.ok) return [];
        
        const keyData = await keyResponse.json();
        return (keyData.accessKeys || []).map((key: any) => {
          const createDate = new Date(key.CreateDate);
          const now = new Date();
          const daysOld = Math.floor((now.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            userName: user.userName,
            accessKeyId: key.AccessKeyId,
            status: key.Status,
            createDate: key.CreateDate,
            daysOld
          };
        });
      });
      
      const allKeys = await Promise.all(keysPromises);
      setAccessKeys(allKeys.flat());
    } catch (err) {
      setError((err as Error).message || 'Erro ao buscar usuários IAM');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKey = (id: string) => {
    setSelectedKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAllKeys = () => {
    const allSelected = accessKeys.every(key => selectedKeys[key.accessKeyId]);
    
    if (allSelected) {
      // Deselecionar todos
      setSelectedKeys({});
    } else {
      // Selecionar todos
      const newSelection = accessKeys.reduce((acc, key) => {
        acc[key.accessKeyId] = true;
        return acc;
      }, {} as {[key: string]: boolean});
      
      setSelectedKeys(newSelection);
    }
  };

  const handleRotateSelected = async () => {
    const keysToRotate = accessKeys.filter(key => selectedKeys[key.accessKeyId]);
    if (keysToRotate.length === 0) {
      setError('Selecione pelo menos uma chave para rotacionar');
      return;
    }
    
    setRotationInProgress(true);
    setRotationResults({ success: [], failed: [] });
    
    // Processar uma chave por vez para evitar erros de limitação de taxa da AWS
    for (const key of keysToRotate) {
      try {
        // 1. Criar uma nova chave para o usuário
        const createResponse = await fetch('/api/aws/iam/users/access-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: key.userName,
            credentialId
          })
        });
        
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.error || `Erro ao criar nova chave para ${key.userName}`);
        }
        
        const createData = await createResponse.json();
        
        // 2. Desativar a chave antiga
        const deactivateResponse = await fetch('/api/aws/iam/users/access-keys', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: key.userName,
            credentialId,
            accessKeyId: key.accessKeyId,
            status: 'Inactive'
          })
        });
        
        if (!deactivateResponse.ok) {
          const errorData = await deactivateResponse.json();
          console.warn(`Aviso: Não foi possível desativar a chave antiga para ${key.userName}:`, errorData.error);
          // Continuar com o processo mesmo se falhar a desativação
        }
        
        // Adicionar ao resultado de sucesso
        setRotationResults(prev => ({
          ...prev,
          success: [...prev.success, { userName: key.userName, accessKey: createData.accessKey }]
        }));
      } catch (err) {
        // Adicionar ao resultado de falha
        setRotationResults(prev => ({
          ...prev,
          failed: [...prev.failed, { userName: key.userName, error: (err as Error).message }]
        }));
      }
    }
    
    setRotationInProgress(false);
    setSelectedKeys({});
    
    // Atualizar a lista de chaves
    fetchUsers();
    
    // Notificar o componente pai
    if (onUpdate) onUpdate();
  };

  const downloadResults = () => {
    const data = {
      date: new Date().toISOString(),
      results: rotationResults
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access-key-rotation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getKeyAgeStatus = (days: number) => {
    if (days > 90) {
      return { color: 'text-red-600', icon: <AlertTriangle className="h-4 w-4 mr-1" />, text: 'Crítico' };
    } else if (days > 60) {
      return { color: 'text-yellow-600', icon: <Clock className="h-4 w-4 mr-1" />, text: 'Atenção' };
    } else {
      return { color: 'text-green-600', icon: <CheckCircle className="h-4 w-4 mr-1" />, text: 'Bom' };
    }
  };

  const selectedCount = Object.values(selectedKeys).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <RotateCw className="h-5 w-5 text-blue-600" />
            Rotação de Chaves de Acesso
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie e rotacione chaves de acesso para aumentar a segurança
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading || rotationInProgress}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleRotateSelected}
            disabled={selectedCount === 0 || isLoading || rotationInProgress}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCount > 0 && !isLoading && !rotationInProgress
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <RotateCw className={`h-4 w-4 ${rotationInProgress ? 'animate-spin' : ''}`} />
            <span>
              {rotationInProgress 
                ? 'Rotacionando...' 
                : `Rotacionar ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
            </span>
          </button>
        </div>
      </div>
      
      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2"
        >
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-start gap-2"
        >
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p>{successMessage}</p>
        </motion.div>
      )}
      
      {/* Rotation Results */}
      {(rotationResults.success.length > 0 || rotationResults.failed.length > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-blue-800 font-medium">Resultados da Rotação</h4>
            <button
              onClick={downloadResults}
              className="text-blue-700 hover:text-blue-900 p-1"
              title="Baixar Resultados"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          {rotationResults.success.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Rotações Bem-sucedidas ({rotationResults.success.length})
              </h5>
              <ul className="text-sm space-y-1 pl-6 list-disc text-green-800">
                {rotationResults.success.map((result, idx) => (
                  <li key={`success-${idx}`}>
                    {result.userName} - Nova chave: {result.accessKey.AccessKeyId}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {rotationResults.failed.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Falhas na Rotação ({rotationResults.failed.length})
              </h5>
              <ul className="text-sm space-y-1 pl-6 list-disc text-red-800">
                {rotationResults.failed.map((result, idx) => (
                  <li key={`failed-${idx}`}>
                    {result.userName} - Erro: {result.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Access Keys Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {accessKeys.length} chave{accessKeys.length !== 1 ? 's' : ''} encontrada{accessKeys.length !== 1 ? 's' : ''}
          </div>
          
          <div>
            <button
              onClick={handleSelectAllKeys}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors"
              disabled={isLoading || rotationInProgress}
            >
              {accessKeys.every(key => selectedKeys[key.accessKeyId])
                ? 'Desmarcar Todos'
                : 'Selecionar Todos'}
            </button>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left">
                <span className="sr-only">Selecionar</span>
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID da Chave
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Idade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  <p className="mt-2">Carregando chaves de acesso...</p>
                </td>
              </tr>
            ) : accessKeys.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  <Key className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <p>Nenhuma chave de acesso encontrada</p>
                </td>
              </tr>
            ) : (
              accessKeys.map((key) => {
                const ageStatus = getKeyAgeStatus(key.daysOld);
                
                return (
                  <tr key={key.accessKeyId} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={!!selectedKeys[key.accessKeyId]}
                        onChange={() => handleSelectKey(key.accessKeyId)}
                        disabled={rotationInProgress}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                          {key.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{key.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {key.accessKeyId}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {key.status === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          Inativa
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(key.createDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <div className={`flex items-center ${ageStatus.color}`}>
                        {ageStatus.icon}
                        <span>{key.daysOld} dias ({ageStatus.text})</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Informações sobre rotação de chaves */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Melhores Práticas para Rotação de Chaves
        </h4>
        <ul className="space-y-2 text-yellow-700 ml-5 list-disc text-sm">
          <li>Rotacione chaves de acesso a cada 90 dias</li>
          <li>Certifique-se de que todos os aplicativos sejam atualizados com as novas chaves</li>
          <li>Após a rotação, observe os sistemas para garantir que estejam funcionando corretamente</li>
          <li>Considere manter as chaves antigas inativas por um período de transição antes de removê-las</li>
          <li>Documente o processo de rotação de chaves e mantenha um registro das datas de rotação</li>
        </ul>
      </div>
    </div>
  );
} 