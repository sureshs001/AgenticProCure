/**
 * Mock implementations for development and testing
 */

import { 
  LLMService, 
  LLMResponse, 
  DatabaseService, 
  DatabaseItem, 
  QueryResult, 
  FileStorageService, 
  FunctionService 
} from './interfaces';

export class MockLLMService implements LLMService {
  private responses: Map<string, string> = new Map([
    ['compliance', 'Based on ISO 13485 and FDA 21 CFR 820 standards, the compliance requirements include: 1) Quality Management System implementation, 2) Risk management according to ISO 14971, 3) Design controls for medical devices, 4) Document control procedures, and 5) Management review processes. These requirements ensure product safety and regulatory compliance in the medical device industry.'],
    ['product_requirements', 'For pharmaceutical and medical device products, key requirements include: 1) Material compatibility testing, 2) Biocompatibility evaluation per ISO 10993, 3) Sterility requirements for sterile products, 4) Packaging validation including child-resistant features, 5) Labeling compliance with FDA and international standards. All requirements must be documented and validated through appropriate testing protocols.'],
    ['supplier_intelligence', 'Supplier evaluation should consider: 1) ISO 13485 or ISO 9001 certification status, 2) FDA registration and inspection history, 3) Financial stability and business continuity plans, 4) Geographic risk assessment, 5) Intellectual property portfolio. Risk scores should be calculated based on compliance history, audit results, and market position. Regular monitoring is essential for maintaining supplier quality.'],
    ['default', 'I understand your question about procurement and compliance. Let me provide you with relevant information based on industry best practices and regulatory standards. For specific guidance, please specify whether you need help with compliance requirements, product specifications, supplier evaluation, or RFP processes.']
  ]);

  async invoke(params: {
    modelId: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Extract agent type from prompt or default
    const agentType = this.extractAgentType(params.prompt);
    const baseResponse = this.responses.get(agentType) || this.responses.get('default')!;
    
    // Add some variation based on the query
    const response = this.personalizeResponse(baseResponse, params.prompt);

    return {
      content: response,
      usage: {
        promptTokens: Math.floor(params.prompt.length / 4),
        completionTokens: Math.floor(response.length / 4),
        totalTokens: Math.floor((params.prompt.length + response.length) / 4)
      }
    };
  }

  private extractAgentType(prompt: string): string {
    if (prompt.toLowerCase().includes('compliance') || prompt.toLowerCase().includes('iso') || prompt.toLowerCase().includes('fda')) {
      return 'compliance';
    }
    if (prompt.toLowerCase().includes('product') || prompt.toLowerCase().includes('requirement') || prompt.toLowerCase().includes('specification')) {
      return 'product_requirements';
    }
    if (prompt.toLowerCase().includes('supplier') || prompt.toLowerCase().includes('vendor') || prompt.toLowerCase().includes('risk')) {
      return 'supplier_intelligence';
    }
    return 'default';
  }

  private personalizeResponse(baseResponse: string, prompt: string): string {
    // Add query-specific elements
    if (prompt.toLowerCase().includes('iso 13485')) {
      return baseResponse + '\n\nSpecifically for ISO 13485, ensure your quality management system includes documented procedures for design controls, corrective and preventive actions (CAPA), and management responsibility.';
    }
    if (prompt.toLowerCase().includes('packaging')) {
      return baseResponse + '\n\nFor packaging specifically, consider USP <671> Containers for pharmaceutical products and child-resistant packaging requirements under CPSC regulations.';
    }
    return baseResponse;
  }
}

export class MockDatabaseService implements DatabaseService {
  private data: Map<string, Map<string, DatabaseItem>> = new Map();

  async put(tableName: string, item: DatabaseItem): Promise<void> {
    if (!this.data.has(tableName)) {
      this.data.set(tableName, new Map());
    }
    
    const table = this.data.get(tableName)!;
    const id = item.id || `${tableName}-${Date.now()}`;
    table.set(id, { ...item, id });
  }

  async get(tableName: string, key: DatabaseItem): Promise<DatabaseItem | null> {
    const table = this.data.get(tableName);
    if (!table) return null;
    
    return table.get(key.id) || null;
  }

  async query(tableName: string, params: {
    keyConditionExpression: string;
    expressionAttributeValues: { [key: string]: any };
    limit?: number;
    scanIndexForward?: boolean;
  }): Promise<QueryResult> {
    const table = this.data.get(tableName);
    if (!table) return { items: [] };

    let items = Array.from(table.values());
    
    // Simple filtering based on agentType
    if (params.expressionAttributeValues[':agentType']) {
      items = items.filter(item => item.agentType === params.expressionAttributeValues[':agentType']);
    }

    // Sort by timestamp if available
    items.sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return params.scanIndexForward ? aTime - bTime : bTime - aTime;
    });

    // Apply limit
    if (params.limit) {
      items = items.slice(0, params.limit);
    }

    return { items };
  }

  async scan(tableName: string, params?: {
    filterExpression?: string;
    expressionAttributeValues?: { [key: string]: any };
    limit?: number;
  }): Promise<QueryResult> {
    const table = this.data.get(tableName);
    if (!table) return { items: [] };

    let items = Array.from(table.values());
    
    if (params?.limit) {
      items = items.slice(0, params.limit);
    }

    return { items };
  }
}

export class MockFileStorageService implements FileStorageService {
  private files: Map<string, Buffer> = new Map();

  async upload(bucket: string, key: string, body: Buffer | Uint8Array | string): Promise<string> {
    const buffer = body instanceof Buffer ? body : Buffer.from(body);
    this.files.set(`${bucket}/${key}`, buffer);
    return `https://mock-s3.amazonaws.com/${bucket}/${key}`;
  }

  async download(bucket: string, key: string): Promise<Buffer> {
    const file = this.files.get(`${bucket}/${key}`);
    if (!file) {
      throw new Error(`File not found: ${bucket}/${key}`);
    }
    return file;
  }

  async delete(bucket: string, key: string): Promise<void> {
    this.files.delete(`${bucket}/${key}`);
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    return `https://mock-s3.amazonaws.com/${bucket}/${key}?signed=true&expires=${Date.now() + expiresIn * 1000}`;
  }
}

export class MockFunctionService implements FunctionService {
  async invoke(functionName: string, payload: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));

    // Mock responses based on function name
    switch (functionName) {
      case 'compliance-agent':
        return {
          statusCode: 200,
          body: JSON.stringify({
            response: 'Compliance monitoring completed. All suppliers are within acceptable risk thresholds.',
            alerts: [],
            timestamp: new Date().toISOString()
          })
        };
      
      case 'product-requirements-agent':
        return {
          statusCode: 200,
          body: JSON.stringify({
            response: 'Product requirements analysis completed. Requirements document processed successfully.',
            requirements: ['ISO 13485 certification', 'Biocompatibility testing', 'Sterility validation'],
            timestamp: new Date().toISOString()
          })
        };
      
      case 'supplier-intelligence-agent':
        return {
          statusCode: 200,
          body: JSON.stringify({
            response: 'Supplier intelligence scan completed. Found 3 qualified suppliers.',
            suppliers: ['PharmaCorp Solutions', 'MedTech Innovations', 'PackagingPro Ltd'],
            timestamp: new Date().toISOString()
          })
        };
      
      default:
        return {
          statusCode: 200,
          body: JSON.stringify({
            response: `Mock response from ${functionName}`,
            timestamp: new Date().toISOString()
          })
        };
    }
  }
}