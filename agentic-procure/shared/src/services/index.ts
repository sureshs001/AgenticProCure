/**
 * Service factory for creating appropriate service implementations
 * based on environment configuration
 */

import { ServiceContainer, ServiceConfig } from './interfaces';
import { MockLLMService, MockDatabaseService, MockFileStorageService, MockFunctionService } from './mocks';
import { AWSLLMService, AWSDatabaseService, AWSS3Service, AWSLambdaService } from './aws';

export class ServiceFactory {
  static create(config: ServiceConfig): ServiceContainer {
    if (config.environment === 'testing' || config.environment === 'development') {
      // Use mock services for development and testing
      return {
        llm: new MockLLMService(),
        database: new MockDatabaseService(),
        fileStorage: new MockFileStorageService(),
        functions: new MockFunctionService(),
      };
    } else {
      // Use real AWS services for production
      return {
        llm: new AWSLLMService(config),
        database: new AWSDatabaseService(config),
        fileStorage: new AWSS3Service(config),
        functions: new AWSLambdaService(config),
      };
    }
  }

  static createConfig(): ServiceConfig {
    const environment = (process.env.NODE_ENV as any) || 'development';
    
    return {
      environment,
      region: process.env.AWS_REGION || 'us-east-1',
      endpoints: environment === 'development' ? {
        dynamodb: process.env.DYNAMODB_ENDPOINT,
        s3: process.env.S3_ENDPOINT,
        lambda: process.env.LAMBDA_ENDPOINT,
      } : undefined,
    };
  }
}

// Export singleton instance for easy access
export const services = ServiceFactory.create(ServiceFactory.createConfig());

// Export individual service classes for direct instantiation if needed
export { ServiceConfig, ServiceContainer } from './interfaces';
export { MockLLMService, MockDatabaseService, MockFileStorageService, MockFunctionService } from './mocks';
export { AWSLLMService, AWSDatabaseService, AWSS3Service, AWSLambdaService } from './aws';