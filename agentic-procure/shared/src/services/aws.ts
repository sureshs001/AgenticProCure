/**
 * AWS service implementations for production
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, GetObjectRequest } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

import { 
  LLMService, 
  LLMResponse, 
  DatabaseService, 
  DatabaseItem, 
  QueryResult, 
  FileStorageService, 
  FunctionService,
  ServiceConfig 
} from './interfaces';

export class AWSLLMService implements LLMService {
  private client: BedrockRuntimeClient;

  constructor(config: ServiceConfig) {
    this.client = new BedrockRuntimeClient({
      region: config.region || 'us-east-1',
    });
  }

  async invoke(params: {
    modelId: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const response = await this.client.send(new InvokeModelCommand({
      modelId: params.modelId,
      contentType: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: params.maxTokens || 4000,
        temperature: params.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: params.prompt,
          },
        ],
      }),
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return {
      content: responseBody.content[0].text,
      usage: responseBody.usage ? {
        promptTokens: responseBody.usage.input_tokens,
        completionTokens: responseBody.usage.output_tokens,
        totalTokens: responseBody.usage.input_tokens + responseBody.usage.output_tokens
      } : undefined
    };
  }
}

export class AWSDatabaseService implements DatabaseService {
  private client: DynamoDBDocumentClient;

  constructor(config: ServiceConfig) {
    const dynamoClient = new DynamoDBClient({
      region: config.region || 'us-east-1',
      ...(config.endpoints?.dynamodb && { endpoint: config.endpoints.dynamodb })
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async put(tableName: string, item: DatabaseItem): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: tableName,
      Item: item,
    }));
  }

  async get(tableName: string, key: DatabaseItem): Promise<DatabaseItem | null> {
    const result = await this.client.send(new GetCommand({
      TableName: tableName,
      Key: key,
    }));
    return result.Item || null;
  }

  async query(tableName: string, params: {
    keyConditionExpression: string;
    expressionAttributeValues: { [key: string]: any };
    limit?: number;
    scanIndexForward?: boolean;
  }): Promise<QueryResult> {
    const result = await this.client.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: params.keyConditionExpression,
      ExpressionAttributeValues: params.expressionAttributeValues,
      Limit: params.limit,
      ScanIndexForward: params.scanIndexForward,
    }));

    return {
      items: result.Items || [],
      lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined
    };
  }

  async scan(tableName: string, params?: {
    filterExpression?: string;
    expressionAttributeValues?: { [key: string]: any };
    limit?: number;
  }): Promise<QueryResult> {
    const result = await this.client.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: params?.filterExpression,
      ExpressionAttributeValues: params?.expressionAttributeValues,
      Limit: params?.limit,
    }));

    return {
      items: result.Items || [],
      lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined
    };
  }
}

export class AWSS3Service implements FileStorageService {
  private client: S3Client;

  constructor(config: ServiceConfig) {
    this.client = new S3Client({
      region: config.region || 'us-east-1',
      ...(config.endpoints?.s3 && { endpoint: config.endpoints.s3 })
    });
  }

  async upload(bucket: string, key: string, body: Buffer | Uint8Array | string): Promise<string> {
    await this.client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    }));
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  async download(bucket: string, key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }));

    if (!response.Body) {
      throw new Error(`File not found: ${bucket}/${key}`);
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async delete(bucket: string, key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    return await getSignedUrl(this.client, command, { expiresIn });
  }
}

export class AWSLambdaService implements FunctionService {
  private client: LambdaClient;

  constructor(config: ServiceConfig) {
    this.client = new LambdaClient({
      region: config.region || 'us-east-1',
      ...(config.endpoints?.lambda && { endpoint: config.endpoints.lambda })
    });
  }

  async invoke(functionName: string, payload: any): Promise<any> {
    const response = await this.client.send(new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    }));

    if (response.Payload) {
      const responsePayload = JSON.parse(new TextDecoder().decode(response.Payload));
      return responsePayload;
    }

    return null;
  }
}