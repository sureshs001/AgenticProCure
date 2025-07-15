/**
 * Service interfaces for abstracting AWS dependencies
 * This allows for easy mocking during testing and development
 */

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMService {
  invoke(params: {
    modelId: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse>;
}

export interface DatabaseItem {
  [key: string]: any;
}

export interface QueryResult {
  items: DatabaseItem[];
  lastEvaluatedKey?: string;
}

export interface DatabaseService {
  put(tableName: string, item: DatabaseItem): Promise<void>;
  get(tableName: string, key: DatabaseItem): Promise<DatabaseItem | null>;
  query(tableName: string, params: {
    keyConditionExpression: string;
    expressionAttributeValues: { [key: string]: any };
    limit?: number;
    scanIndexForward?: boolean;
  }): Promise<QueryResult>;
  scan(tableName: string, params?: {
    filterExpression?: string;
    expressionAttributeValues?: { [key: string]: any };
    limit?: number;
  }): Promise<QueryResult>;
}

export interface FileStorageService {
  upload(bucket: string, key: string, body: Buffer | Uint8Array | string): Promise<string>;
  download(bucket: string, key: string): Promise<Buffer>;
  delete(bucket: string, key: string): Promise<void>;
  getSignedUrl(bucket: string, key: string, expiresIn?: number): Promise<string>;
}

export interface FunctionService {
  invoke(functionName: string, payload: any): Promise<any>;
}

export interface ServiceContainer {
  llm: LLMService;
  database: DatabaseService;
  fileStorage: FileStorageService;
  functions: FunctionService;
}

export interface ServiceConfig {
  environment: 'development' | 'testing' | 'production';
  region?: string;
  endpoints?: {
    dynamodb?: string;
    s3?: string;
    lambda?: string;
  };
}