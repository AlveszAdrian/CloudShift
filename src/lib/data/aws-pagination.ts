import { AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

interface PaginationOptions {
  maxPages?: number;
  maxItems?: number;
  delayBetweenRequests?: number; // em ms, para evitar throttling
}

const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
  maxPages: 10, // Limite padrão de 10 páginas
  maxItems: 1000, // Limite padrão de 1000 itens
  delayBetweenRequests: 100 // 100ms entre requisições
};

// Função de pausa para evitar throttling em requisições sequenciais
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Função genérica para lidar com paginação nas chamadas de API AWS
 * @param fetcher Função que faz a chamada para a API e retorna uma Promise
 * @param getItems Função que extrai os itens da resposta
 * @param getNextToken Função que extrai o token de paginação da resposta
 * @param setNextToken Função que configura o token de paginação para a próxima chamada
 * @param options Opções de configuração da paginação
 * @returns Array com todos os itens coletados
 */
export async function paginateAWSRequest<ResponseType, ItemType, RequestType extends object>(
  fetcher: (request: RequestType) => Promise<PromiseResult<ResponseType, AWSError>>,
  getItems: (response: ResponseType) => ItemType[] | undefined,
  getNextToken: (response: ResponseType) => string | undefined,
  setNextToken: (request: RequestType, token: string) => RequestType,
  initialRequest: RequestType,
  options: PaginationOptions = DEFAULT_PAGINATION_OPTIONS
): Promise<ItemType[]> {
  const results: ItemType[] = [];
  let currentRequest = { ...initialRequest };
  let pageCount = 0;
  
  const maxPages = options.maxPages || DEFAULT_PAGINATION_OPTIONS.maxPages!;
  const maxItems = options.maxItems || DEFAULT_PAGINATION_OPTIONS.maxItems!;
  const delayMs = options.delayBetweenRequests || DEFAULT_PAGINATION_OPTIONS.delayBetweenRequests!;
  
  console.log(`Iniciando paginação com limite de ${maxPages} páginas ou ${maxItems} itens`);
  
  while (pageCount < maxPages && results.length < maxItems) {
    pageCount++;
    console.log(`Buscando página ${pageCount}...`);
    
    try {
      const response = await fetcher(currentRequest);
      const items = getItems(response) || [];
      
      console.log(`Página ${pageCount}: ${items.length} itens recebidos`);
      results.push(...items);
      
      const nextToken = getNextToken(response);
      if (!nextToken) {
        console.log('Não há mais páginas disponíveis. Paginação concluída.');
        break;
      }
      
      if (results.length >= maxItems) {
        console.log(`Limite de ${maxItems} itens atingido. Paginação interrompida.`);
        break;
      }
      
      // Configurar para próxima página
      currentRequest = setNextToken(currentRequest, nextToken);
      
      // Pausa para evitar throttling
      if (delayMs > 0) {
        await delay(delayMs);
      }
    } catch (error) {
      console.error(`Erro ao buscar página ${pageCount}:`, error);
      throw error;
    }
  }
  
  console.log(`Paginação concluída. Total de páginas: ${pageCount}, total de itens: ${results.length}`);
  return results;
}

// Exemplos de uso para serviços específicos
export const S3Paginator = {
  listObjectsV2: async (
    s3Client: AWS.S3, 
    params: AWS.S3.ListObjectsV2Request, 
    options?: PaginationOptions
  ): Promise<AWS.S3.Object[]> => {
    return paginateAWSRequest<AWS.S3.ListObjectsV2Output, AWS.S3.Object, AWS.S3.ListObjectsV2Request>(
      (req) => s3Client.listObjectsV2(req).promise(),
      (res) => res.Contents,
      (res) => res.NextContinuationToken,
      (req, token) => ({ ...req, ContinuationToken: token }),
      params,
      options
    );
  }
};

export const IAMPaginator = {
  listUsers: async (
    iamClient: AWS.IAM,
    params: AWS.IAM.ListUsersRequest = {},
    options?: PaginationOptions
  ): Promise<AWS.IAM.User[]> => {
    return paginateAWSRequest<AWS.IAM.ListUsersResponse, AWS.IAM.User, AWS.IAM.ListUsersRequest>(
      (req) => iamClient.listUsers(req).promise(),
      (res) => res.Users,
      (res) => res.Marker,
      (req, token) => ({ ...req, Marker: token }),
      params,
      options
    );
  }
}; 