import { useState, useEffect } from "react";
import { 
  Key, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ShieldOff, 
  Shield, 
  RotateCw, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clipboard,
  Download,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";

interface AccessKey {
  AccessKeyId: string;
  Status: string;
  CreateDate: string;
  UserName?: string;
  SecretAccessKey?: string;
}

interface AccessKeyManagerProps {
  userName: string;
  credentialId: string;
  onUpdate?: () => void;
}

export default function AccessKeyManager({ userName, credentialId, onUpdate }: AccessKeyManagerProps) {
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<AccessKey | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null);
  const [activateConfirm, setActivateConfirm] = useState<string | null>(null);
  const [rotateConfirm, setRotateConfirm] = useState<string | null>(null);
  
  // Buscar chaves ao carregar o componente
  useEffect(() => {
    fetchAccessKeys();
  }, [userName, credentialId]);
  
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

  const fetchAccessKeys = async () => {
    if (!userName || !credentialId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/aws/iam/users/access-keys?userName=${encodeURIComponent(userName)}&credentialId=${encodeURIComponent(credentialId)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar chaves de acesso');
      }
      
      const data = await response.json();
      setAccessKeys(data.accessKeys || []);
    } catch (err) {
      setError((err as Error).message || 'Erro ao buscar chaves de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    setIsLoading(true);
    setError(null);
    setNewKey(null);
    
    try {
      const response = await fetch('/api/aws/iam/users/access-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          credentialId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar chave de acesso');
      }
      
      const data = await response.json();
      setNewKey(data.accessKey);
      setShowSecretKey(true);
      setSuccessMessage('Chave de acesso criada com sucesso! Salve a chave secreta, ela não será mostrada novamente.');
      
      // Atualizar a lista de chaves
      fetchAccessKeys();
      
      // Notificar o componente pai sobre a atualização
      if (onUpdate) onUpdate();
    } catch (err) {
      setError((err as Error).message || 'Erro ao criar chave de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async (accessKeyId: string) => {
    if (deleteConfirm !== accessKeyId) {
      setDeleteConfirm(accessKeyId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/aws/iam/users/access-keys?userName=${encodeURIComponent(userName)}&credentialId=${encodeURIComponent(credentialId)}&accessKeyId=${encodeURIComponent(accessKeyId)}`,
        {
          method: 'DELETE'
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir chave de acesso');
      }
      
      setSuccessMessage('Chave de acesso excluída com sucesso');
      setDeleteConfirm(null);
      
      // Atualizar a lista de chaves
      fetchAccessKeys();
      
      // Notificar o componente pai sobre a atualização
      if (onUpdate) onUpdate();
    } catch (err) {
      setError((err as Error).message || 'Erro ao excluir chave de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateKey = async (accessKeyId: string) => {
    if (deactivateConfirm !== accessKeyId) {
      setDeactivateConfirm(accessKeyId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/aws/iam/users/access-keys', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          credentialId,
          accessKeyId,
          status: 'Inactive'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao desativar chave de acesso');
      }
      
      setSuccessMessage('Chave de acesso desativada com sucesso');
      setDeactivateConfirm(null);
      
      // Atualizar a lista de chaves
      fetchAccessKeys();
      
      // Notificar o componente pai sobre a atualização
      if (onUpdate) onUpdate();
    } catch (err) {
      setError((err as Error).message || 'Erro ao desativar chave de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateKey = async (accessKeyId: string) => {
    if (activateConfirm !== accessKeyId) {
      setActivateConfirm(accessKeyId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/aws/iam/users/access-keys', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          credentialId,
          accessKeyId,
          status: 'Active'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao ativar chave de acesso');
      }
      
      setSuccessMessage('Chave de acesso ativada com sucesso');
      setActivateConfirm(null);
      
      // Atualizar a lista de chaves
      fetchAccessKeys();
      
      // Notificar o componente pai sobre a atualização
      if (onUpdate) onUpdate();
    } catch (err) {
      setError((err as Error).message || 'Erro ao ativar chave de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotateKey = async (accessKeyId: string) => {
    if (rotateConfirm !== accessKeyId) {
      setRotateConfirm(accessKeyId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Criar uma nova chave
      const createResponse = await fetch('/api/aws/iam/users/access-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          credentialId
        })
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Erro ao criar nova chave de acesso');
      }
      
      const createData = await createResponse.json();
      setNewKey(createData.accessKey);
      setShowSecretKey(true);
      
      // 2. Desativar a chave antiga
      const deactivateResponse = await fetch('/api/aws/iam/users/access-keys', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          credentialId,
          accessKeyId,
          status: 'Inactive'
        })
      });
      
      if (!deactivateResponse.ok) {
        const errorData = await deactivateResponse.json();
        console.error('Erro ao desativar chave antiga:', errorData.error);
        // Não lançar erro para continuar o processo
      }
      
      setSuccessMessage('Chave de acesso rotacionada com sucesso! Salve a nova chave secreta, ela não será mostrada novamente.');
      setRotateConfirm(null);
      
      // Atualizar a lista de chaves
      fetchAccessKeys();
      
      // Notificar o componente pai sobre a atualização
      if (onUpdate) onUpdate();
    } catch (err) {
      setError((err as Error).message || 'Erro ao rotacionar chave de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [id]: true });
      setTimeout(() => {
        setCopied({ ...copied, [id]: false });
      }, 2000);
    });
  };

  const downloadCredentials = () => {
    if (!newKey || !newKey.SecretAccessKey) return;
    
    const credentials = {
      AccessKeyId: newKey.AccessKeyId,
      SecretAccessKey: newKey.SecretAccessKey
    };
    
    const blob = new Blob([JSON.stringify(credentials, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-credentials-${userName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const canCreateNewKey = accessKeys.length < 2;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Chaves de Acesso</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAccessKeys}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleCreateKey}
            disabled={!canCreateNewKey || isLoading}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors
              ${canCreateNewKey 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Chave</span>
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
      
      {/* New Key Display */}
      {newKey && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-blue-800 font-medium">Nova Chave de Acesso Criada</h4>
            <div className="flex gap-2">
              <button
                onClick={downloadCredentials}
                className="text-blue-700 hover:text-blue-900 p-1"
                title="Baixar Credenciais"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                ID da Chave de Acesso
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={newKey.AccessKeyId}
                  className="flex-1 p-2 bg-white border border-blue-300 rounded-l-md text-sm focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(newKey.AccessKeyId, 'access-key-id')}
                  className="p-2 bg-blue-100 border border-blue-300 border-l-0 rounded-r-md hover:bg-blue-200 transition-colors"
                >
                  {copied['access-key-id'] ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-700" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1 flex justify-between">
                <span>Chave de Acesso Secreta</span>
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                >
                  {showSecretKey ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Mostrar
                    </>
                  )}
                </button>
              </label>
              <div className="flex items-center">
                <input
                  type={showSecretKey ? "text" : "password"}
                  readOnly
                  value={newKey.SecretAccessKey || ''}
                  className="flex-1 p-2 bg-white border border-blue-300 rounded-l-md text-sm focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(newKey.SecretAccessKey || '', 'secret-access-key')}
                  className="p-2 bg-blue-100 border border-blue-300 border-l-0 rounded-r-md hover:bg-blue-200 transition-colors"
                >
                  {copied['secret-access-key'] ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Importante</p>
                <p>Esta é a única vez que a chave de acesso secreta será mostrada. Salve-a em um local seguro.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Access Keys Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID da Chave
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && !accessKeys.length ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  <p className="mt-2">Carregando chaves de acesso...</p>
                </td>
              </tr>
            ) : accessKeys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  <Key className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <p>Nenhuma chave de acesso encontrada</p>
                </td>
              </tr>
            ) : (
              accessKeys.map((key) => (
                <tr key={key.AccessKeyId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key.AccessKeyId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {key.Status === 'Active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ShieldOff className="h-3 w-3 mr-1" />
                        Inativa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(key.CreateDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {key.Status === 'Active' ? (
                      <button
                        onClick={() => handleDeactivateKey(key.AccessKeyId)}
                        className={`text-yellow-600 hover:text-yellow-900 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                        title="Desativar Chave"
                      >
                        {deactivateConfirm === key.AccessKeyId ? (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Confirmar</span>
                        ) : (
                          <ShieldOff className="h-4 w-4 inline" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateKey(key.AccessKeyId)}
                        className={`text-green-600 hover:text-green-900 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                        title="Ativar Chave"
                      >
                        {activateConfirm === key.AccessKeyId ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmar</span>
                        ) : (
                          <Shield className="h-4 w-4 inline" />
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRotateKey(key.AccessKeyId)}
                      className={`text-blue-600 hover:text-blue-900 ${!canCreateNewKey || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!canCreateNewKey || isLoading}
                      title={canCreateNewKey ? "Rotacionar Chave" : "Exclua uma chave existente antes de rotacionar"}
                    >
                      {rotateConfirm === key.AccessKeyId ? (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Confirmar</span>
                      ) : (
                        <RotateCw className="h-4 w-4 inline" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteKey(key.AccessKeyId)}
                      className={`text-red-600 hover:text-red-900 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                      title="Excluir Chave"
                    >
                      {deleteConfirm === key.AccessKeyId ? (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Confirmar</span>
                      ) : (
                        <Trash2 className="h-4 w-4 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Best Practices */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm">
        <h4 className="font-medium text-gray-900 mb-2">Melhores Práticas para Chaves de Acesso</h4>
        <ul className="space-y-2 text-gray-700 ml-5 list-disc">
          <li>Rotacione as chaves regularmente (a cada 90 dias)</li>
          <li>Nunca compartilhe chaves de acesso entre usuários ou aplicações</li>
          <li>Armazene chaves de acesso de forma segura e criptografada</li>
          <li>Use políticas IAM para restringir permissões das chaves de acesso</li>
          <li>Desative ou exclua chaves que não estão em uso</li>
        </ul>
      </div>
    </div>
  );
} 