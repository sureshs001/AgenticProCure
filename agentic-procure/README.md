# Agentic ProCURE

An AI-agent-native procurement solution for MedTech and Pharma industries to manage compliance, product requirements, and streamline the RFP process.

## 🚀 Features

### Core Modules

1. **Risk and Compliance Dashboard (AI Agent Driven)**
   - Periodically run AI agents to populate compliance and risk dashboard
   - Alert users when suppliers lose compliance for standards
   - Trigger alerts based on news articles or web searches
   - Search for specific suppliers or standards to view compliance status

2. **Product Requirement Repository (AI Agent Assisted)**
   - Upload and process product requirement documents
   - AI agent processes documents to create compliance requirements
   - Searchable repository for specific requirements
   - Agent interface for chatting with product requirements data

3. **Agentic Guided RFP Process**
   - Start new RFPs by adding/creating products or selecting from repository
   - Agentic guidance to extract specific compliance requirements
   - Suggest suppliers who meet requirements
   - Facilitate creation of RFP artifacts
   - Agentic oversight throughout the RFP process

### Agentic Capabilities

- **SME Personas**: Product SME and Compliance SME agents
- **Generic Agentic Conversations**: Contextual data usage based on current screen
- **Workflow Automation**: RFP generation, product repository management, compliance oversight

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript 5.8.3
- **Backend**: Node.js with Express
- **AI Framework**: AWS Bedrock with Strands framework (with local mock support)
- **Cloud**: AWS (Lambda, DynamoDB, S3) - **Optional for development**
- **Deployment**: AWS Amplify

## 📁 Project Structure

```
agentic-procure/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
├── agents/                  # AI agent implementations
│   ├── compliance/         # Compliance monitoring agent
│   ├── product-requirements/ # Product requirements agent
│   └── supplier-intelligence/ # Supplier intelligence agent
├── shared/                  # Shared types, constants, and services
│   ├── src/
│   │   ├── types/          # TypeScript type definitions
│   │   ├── constants/      # Application constants
│   │   └── services/       # Service abstractions (AWS + Mocks)
├── ENVIRONMENT.md           # Environment configuration guide
├── .env.example            # Example environment configuration
└── test-no-aws.js         # Test script for AWS-free operation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- **No AWS account required for development!**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agentic-procure
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment for development (No AWS required)**
   ```bash
   # Copy environment example
   cp .env.example .env
   
   # The default configuration uses mock services
   export NODE_ENV=development
   export API_KEY=agentic-procure-dev-key-123
   ```

4. **Build all packages**
   ```bash
   npm run build
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:3001
   ```

6. **Test without AWS dependencies**
   ```bash
   # Run comprehensive test
   node test-no-aws.js
   
   # Run all tests
   npm run test
   ```

## ✨ New: AWS-Free Development

### 🎯 Zero AWS Setup Required

The application now supports full development and testing **without any AWS dependencies**:

✅ **Mock Services Include:**
- **AI/LLM**: Realistic responses with compliance knowledge
- **Database**: Full query capabilities with in-memory storage  
- **File Storage**: Document upload/download simulation
- **Functions**: Agent deployment mocking

✅ **Full Feature Set Available:**
- Complete agent chat interface
- Compliance monitoring and alerts
- Product requirements analysis
- Supplier intelligence
- RFP management workflow
- Document processing simulation

✅ **Development Experience:**
- Hot reloading and fast iteration
- Consistent TypeScript 5.8.3 across all modules
- Proper build dependency management
- Comprehensive testing framework

### 🔄 Environment Modes

| Environment | Services Used | Use Case |
|-------------|---------------|----------|
| `development` | Mock services | Local development |
| `testing` | Mock services | Unit/integration tests |
| `production` | Real AWS services | Production deployment |

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed configuration.

## 📋 MVP Scope

The MVP includes:

- **Sample Products**: One pharma, one MedTech, and one Software as Medical Device product
- **Compliance Mapping**: Requirements mapped to compliance requirements
- **Guidance Documents**: Important guidance for plastics, packaging, ISO 13485 compliance
- **Deep Engineering Questions**: Address deeper engineering questions related to packaging/material requirements

## 🤖 AI Agents

### Compliance Agent
- Monitors supplier compliance status
- Generates risk alerts
- Tracks compliance deadlines
- Analyzes compliance trends

### Product Requirements Agent
- Processes uploaded documents
- Extracts compliance requirements
- Answers product-specific questions
- Maps requirements to standards

### Supplier Intelligence Agent
- Evaluates supplier capabilities
- Assesses supplier risk
- Suggests suitable suppliers for RFPs
- Monitors supplier updates

### General Assistant
- Handles general procurement questions
- Provides contextual assistance
- Integrates with all system data

## 🔧 Configuration

### Development (No AWS Required)
```bash
NODE_ENV=development
API_KEY=your-dev-key
```

### Production (AWS Required)
```bash
NODE_ENV=production
AWS_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
# ... other AWS configurations
```

## 🔍 Troubleshooting

### Build Issues

✅ **Fixed Issues:**
- ✅ TypeScript version consistency (all modules use 5.8.3)
- ✅ Build order dependencies (shared → others)
- ✅ Module resolution for shared package
- ✅ Deprecated AWS SDK v2 removed

If you encounter build errors:

1. **Clean install**: 
   ```bash
   rm -rf node_modules package-lock.json
   npm run install:all
   ```

2. **Build in order**:
   ```bash
   npm run build
   # Automatically builds: shared → frontend → backend → agents
   ```

3. **Test without AWS**:
   ```bash
   node test-no-aws.js
   ```

## 📊 API Endpoints

### Agents
- `GET /api/agents/config` - Get agent configurations
- `POST /api/agents/chat` - Chat with agents
- `GET /api/agents/chat/history` - Get chat history

### Compliance
- `GET /api/compliance/dashboard` - Get compliance dashboard
- `GET /api/compliance/alerts` - Get compliance alerts
- `GET /api/compliance/standards` - Get compliance standards

### Product Requirements
- `GET /api/product-requirements` - Get product requirements
- `GET /api/product-requirements/dashboard` - Get dashboard
- `POST /api/product-requirements/upload` - Upload documents

### RFPs
- `GET /api/rfps` - Get RFPs
- `GET /api/rfps/dashboard` - Get RFP dashboard

## 🚀 Deployment

### Development Deployment (Mock Services)
```bash
# Set development environment
export NODE_ENV=development

# Build and start
npm run build
npm run dev
```

### Production Deployment (AWS Services)
```bash
# Configure AWS credentials and environment
export NODE_ENV=production
# ... AWS configuration

# Build and deploy
npm run build
# Deploy to your preferred platform
```

## 🧪 Testing

### Without AWS Dependencies
```bash
# Run all tests (passes without AWS)
npm run test

# Custom integration test
node test-no-aws.js

# Test individual modules
npm run test:frontend
npm run test:backend
npm run test:agents
npm run test:shared
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (they work without AWS!)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check [ENVIRONMENT.md](./ENVIRONMENT.md) for configuration help

## 🔮 Roadmap

- [x] AWS-free development environment
- [x] TypeScript 5.8.3 upgrade across all modules  
- [x] Service abstraction layer with mocks
- [x] Proper build dependency management
- [ ] Real-time compliance monitoring
- [ ] Advanced supplier analytics
- [ ] Integration with ERP systems
- [ ] Mobile application
- [ ] Advanced AI model fine-tuning
- [ ] Multi-tenant architecture

## 📋 MVP Scope

The MVP includes:

- **Sample Products**: One pharma, one MedTech, and one Software as Medical Device product
- **Compliance Mapping**: Requirements mapped to compliance requirements
- **Guidance Documents**: Important guidance for plastics, packaging, ISO 13485 compliance
- **Deep Engineering Questions**: Address deeper engineering questions related to packaging/material requirements

## 🤖 AI Agents

### Compliance Agent
- Monitors supplier compliance status
- Generates risk alerts
- Tracks compliance deadlines
- Analyzes compliance trends

### Product Requirements Agent
- Processes uploaded documents
- Extracts compliance requirements
- Answers product-specific questions
- Maps requirements to standards

### Supplier Intelligence Agent
- Evaluates supplier capabilities
- Assesses supplier risk
- Suggests suitable suppliers for RFPs
- Monitors supplier updates

### General Assistant
- Handles general procurement questions
- Provides contextual assistance
- Integrates with all system data

## 🔧 Configuration

### AWS Bedrock Setup

1. Configure AWS credentials
2. Enable Bedrock access for your account
3. Set up appropriate IAM roles and permissions

### Agent Configuration

Agents are configured via the backend API and can be customized for:
- Model selection (Claude, GPT, etc.)
- Temperature and token limits
- System prompts
- Tool integrations
- Scheduling

## 🔍 Troubleshooting

### Build Issues

If you encounter build errors:

1. **TypeScript Errors**: Ensure all packages have proper `tsconfig.json` files
2. **Module Resolution**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
3. **Workspace Issues**: Build packages individually to isolate issues:
   ```bash
   cd shared && npm run build
   cd ../backend && npm run build
   cd ../frontend && npm run build
   cd ../agents && npm run build
   ```

### Development Server Issues

1. **Port Conflicts**: Change ports in environment files if 3000/3001 are in use
2. **Memory Issues**: Increase Node.js memory limit: `export NODE_OPTIONS="--max-old-space-size=4096"`
3. **AWS Credentials**: Verify AWS credentials are properly configured in `.env` files

### Common Issues

- **"Can't resolve './App'"**: Missing TypeScript configuration - ensure `tsconfig.json` exists in frontend
- **Process is not defined**: Missing Node.js types - ensure proper TypeScript config in backend/agents
- **AWS Bedrock Access**: Verify your AWS account has Bedrock model access enabled

## 📊 API Endpoints

### Agents
- `GET /api/agents/config` - Get agent configurations
- `POST /api/agents/chat` - Chat with agents
- `GET /api/agents/chat/history` - Get chat history

### Compliance
- `GET /api/compliance/dashboard` - Get compliance dashboard
- `GET /api/compliance/alerts` - Get compliance alerts
- `GET /api/compliance/standards` - Get compliance standards

### Product Requirements
- `GET /api/product-requirements` - Get product requirements
- `GET /api/product-requirements/dashboard` - Get dashboard
- `POST /api/product-requirements/upload` - Upload documents

### RFPs
- `GET /api/rfps` - Get RFPs
- `GET /api/rfps/dashboard` - Get RFP dashboard

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy to AWS Amplify or your preferred hosting
```

### Backend Deployment
```bash
cd backend
npm run build
# Deploy to AWS Lambda or EC2
```

### Agent Deployment
```bash
cd agents
npm run deploy:compliance
npm run deploy:product-requirements
npm run deploy:supplier-intelligence
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Roadmap

- [ ] Real-time compliance monitoring
- [ ] Advanced supplier analytics
- [ ] Integration with ERP systems
- [ ] Mobile application
- [ ] Advanced AI model fine-tuning
- [ ] Multi-tenant architecture 