import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../../utils/authMiddleware';
import { createError } from '../../utils/errorHandler';
import { AgentRequest, AgentResponse, AgentConfig } from '@agentic-procure/shared';

const router = Router();

// Get all agent configurations
router.get('/config', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock agent configurations for MVP
    const agentConfigs: AgentConfig[] = [
      {
        id: 'compliance-agent-001',
        name: 'Compliance Monitoring Agent',
        type: 'compliance',
        model: 'anthropic.claude-3-sonnet-20240229-v1:0',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are a compliance monitoring agent specialized in pharmaceutical and medical device regulations. Analyze compliance data and provide insights on regulatory requirements.',
        tools: ['compliance_checker', 'risk_assessor', 'alert_generator'],
        schedule: '0 */6 * * *',
      },
      {
        id: 'product-requirements-agent-001',
        name: 'Product Requirements Agent',
        type: 'product_requirements',
        model: 'anthropic.claude-3-sonnet-20240229-v1:0',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are a product requirements specialist agent. Help users understand compliance requirements for pharmaceutical and medical device products.',
        tools: ['document_analyzer', 'requirement_extractor', 'compliance_mapper'],
      },
      {
        id: 'supplier-intelligence-agent-001',
        name: 'Supplier Intelligence Agent',
        type: 'supplier_intelligence',
        model: 'anthropic.claude-3-sonnet-20240229-v1:0',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are a supplier intelligence agent. Help users find and evaluate suppliers based on compliance and technical requirements.',
        tools: ['supplier_finder', 'risk_assessor', 'compliance_checker'],
      },
    ];

    res.json({
      success: true,
      data: agentConfigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent configurations',
    });
  }
});

// Chat with an agent
router.post('/chat', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, agentType, context, options }: AgentRequest = req.body;

    if (!query || !agentType) {
      throw createError('Query and agentType are required', 400);
    }

    // Mock agent response for MVP
    // In production, this would call the actual agent via AWS Bedrock
    const mockResponse: AgentResponse = {
      id: `response-${Date.now()}`,
      agentType: agentType as any,
      query,
      response: `This is a mock response from the ${agentType} agent. In production, this would be generated by AWS Bedrock using the Strands framework.`,
      confidence: 0.85,
      sources: ['ISO 13485:2016', 'FDA 21 CFR 820'],
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: mockResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process agent chat request',
      });
    }
  }
});

// Get agent chat history
router.get('/chat/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { agentType, limit = 20, offset = 0 } = req.query;

    // Mock chat history for MVP
    const mockHistory: AgentResponse[] = [
      {
        id: 'response-001',
        agentType: 'compliance',
        query: 'What are the compliance requirements for ISO 13485?',
        response: 'ISO 13485 is a quality management system standard for medical devices. Key requirements include...',
        confidence: 0.9,
        sources: ['ISO 13485:2016'],
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'response-002',
        agentType: 'product_requirements',
        query: 'What packaging requirements apply to oral solid dosage forms?',
        response: 'Oral solid dosage forms require child-resistant packaging per USP standards...',
        confidence: 0.85,
        sources: ['USP <671>', 'FDA 21 CFR 211'],
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];

    res.json({
      success: true,
      data: {
        items: mockHistory,
        total: mockHistory.length,
        page: parseInt(offset as string) || 0,
        limit: parseInt(limit as string) || 20,
        hasMore: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
});

export default router; 