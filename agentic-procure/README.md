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

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **AI Framework**: AWS Bedrock with Strands framework
- **Cloud**: AWS (Lambda, DynamoDB, S3)
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
└── shared/                  # Shared types and constants
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- AWS Account with Bedrock access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agentic-procure
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit the files with your AWS credentials and configuration
   ```

4. **Build all packages**
   ```bash
   # Build all packages (frontend, backend, agents, shared)
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