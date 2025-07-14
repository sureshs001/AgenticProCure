# Environment Configuration for AgenticProCure

## Overview

AgenticProCure supports multiple environments with automatic service switching:

- **Development**: Uses mock services (no AWS required)
- **Testing**: Uses mock services (no AWS required)  
- **Production**: Uses real AWS services

## Environment Variables

### Core Configuration
```bash
# Environment (development, testing, production)
NODE_ENV=development

# API Key for basic authentication (development/testing)
API_KEY=your-api-key-here

# AWS Configuration (production only)
AWS_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
```

### Local Development Endpoints (Optional)
```bash
# Use local DynamoDB (if running locally)
DYNAMODB_ENDPOINT=http://localhost:8000

# Use local S3 (if running localstack)
S3_ENDPOINT=http://localhost:4566

# Use local Lambda (if running localstack)
LAMBDA_ENDPOINT=http://localhost:4566
```

## Running Without AWS Dependencies

### 1. Development Environment
```bash
# Set environment
export NODE_ENV=development
export API_KEY=test-api-key-123

# Install dependencies
npm run install:all

# Build all modules
npm run build

# Run development servers
npm run dev
```

### 2. Testing Environment
```bash
# Set environment for testing
export NODE_ENV=testing

# Run tests
npm run test

# Run custom test script
node test-no-aws.js
```

### 3. Individual Services
```bash
# Frontend only (runs on port 3000)
npm run dev:frontend

# Backend only (runs on port 3001) 
npm run dev:backend

# Build specific modules
npm run build:frontend
npm run build:backend
npm run build:agents
npm run build:shared
```

## Service Architecture

### Mock Services (Development/Testing)
- **LLM Service**: Returns realistic AI responses with compliance knowledge
- **Database Service**: In-memory storage with full query capabilities
- **File Storage**: In-memory file storage with signed URL generation
- **Function Service**: Mock Lambda responses for agent deployments

### AWS Services (Production)
- **Bedrock**: Claude 3 for LLM capabilities
- **DynamoDB**: Agent responses and configuration storage
- **S3**: Document and file storage
- **Lambda**: Agent deployment and execution

## Features Available Without AWS

✅ **Full Application Functionality**
- Agent chat interface
- Compliance monitoring
- Product requirements analysis
- Supplier intelligence
- RFP management
- Document upload (mock storage)

✅ **Realistic AI Responses**
- Context-aware responses
- Compliance standards knowledge
- Industry-specific guidance
- Confidence scoring and source attribution

✅ **Complete Development Workflow**
- TypeScript compilation
- Build processes
- Testing framework
- Hot reloading in development

## Migration to AWS

When ready to use AWS services:

1. Set `NODE_ENV=production`
2. Configure AWS credentials
3. Set up DynamoDB tables
4. Configure S3 buckets
5. Deploy Lambda functions
6. Update Bedrock model access

The service abstraction layer ensures seamless transition between mock and real services.