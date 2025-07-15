import { AgentConfig, AgentContext, AgentRequest, AgentResponse, services } from '@agentic-procure/shared';

export class ComplianceAgent {
  private config: AgentConfig;

  constructor() {
    this.config = {
      id: 'compliance-agent-001',
      name: 'Compliance Monitoring Agent',
      type: 'compliance',
      model: process.env.AWS_BEDROCK_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0',
      temperature: 0.7,
      maxTokens: 4000,
      systemPrompt: `You are a compliance monitoring agent specialized in pharmaceutical and medical device regulations. 
      Your role is to:
      1. Analyze compliance data and provide insights on regulatory requirements
      2. Assess supplier compliance risks
      3. Monitor compliance deadlines and generate alerts
      4. Provide guidance on ISO 13485, FDA 21 CFR 820, FDA 21 CFR 211, and other relevant standards
      5. Answer questions about compliance requirements and best practices
      
      Always provide accurate, up-to-date information and cite relevant standards when possible.`,
      tools: ['compliance_checker', 'risk_assessor', 'alert_generator'],
      schedule: '0 */6 * * *', // Every 6 hours
    };
  }

  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await services.llm.invoke({
        modelId: this.config.model,
        prompt,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
      });

      const agentResponse: AgentResponse = {
        id: `response-${Date.now()}`,
        agentType: 'compliance',
        query: request.query,
        response: response.content,
        confidence: this.calculateConfidence(response.content),
        sources: this.extractSources(response.content),
        timestamp: new Date().toISOString(),
      };

      // Store the response in the database
      await this.storeResponse(agentResponse);

      return agentResponse;
    } catch (error) {
      console.error('Error processing compliance agent request:', error);
      throw new Error('Failed to process compliance request');
    }
  }

  private buildPrompt(request: AgentRequest): string {
    const context = request.context;
    const query = request.query;

    return `${this.config.systemPrompt}

Current Context:
- User: ${context.userId}
- Organization: ${context.organization}
- Current Screen: ${context.currentScreen}
- Session Data: ${JSON.stringify(context.sessionData)}

User Query: ${query}

Please provide a comprehensive response that addresses the user's question while considering the current context. 
If this is a compliance-related question, include relevant standards and requirements.
If this is a risk assessment request, provide detailed analysis with recommendations.
If this is a deadline monitoring request, provide specific dates and actions required.`;
  }

  private calculateConfidence(content: string): number {
    // Simple confidence calculation based on content length and keywords
    const hasStandards = /ISO|FDA|CE|USP|EP|JP/.test(content);
    const hasRecommendations = /recommend|suggest|should|must|required/.test(content);
    const hasSpecifics = /\d{4}|\d{2}\/\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/.test(content);
    
    let confidence = 0.7; // Base confidence
    
    if (hasStandards) confidence += 0.1;
    if (hasRecommendations) confidence += 0.1;
    if (hasSpecifics) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private extractSources(content: string): string[] {
    const sources: string[] = [];
    
    // Extract common compliance standards
    const standards = content.match(/(ISO\s+\d+[:\-]\d+)|(FDA\s+\d+\s+CFR\s+\d+)|(CE\s+MDR)|(USP\s+<[^>]+>)/gi);
    if (standards) {
      sources.push(...standards);
    }
    
    return sources;
  }

  private async storeResponse(response: AgentResponse): Promise<void> {
    try {
      await services.database.put('agentic-procure-responses', {
        id: response.id,
        agentType: response.agentType,
        query: response.query,
        response: response.response,
        confidence: response.confidence,
        sources: response.sources,
        timestamp: response.timestamp,
        ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days TTL
      });
    } catch (error) {
      console.error('Error storing agent response:', error);
    }
  }

  async getChatHistory(agentType: string, limit: number = 20, offset: number = 0): Promise<AgentResponse[]> {
    try {
      const result = await services.database.query('agentic-procure-responses', {
        keyConditionExpression: 'agentType = :agentType',
        expressionAttributeValues: {
          ':agentType': agentType,
        },
        scanIndexForward: false, // Most recent first
        limit,
      });

      return result.items as AgentResponse[];
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      return [];
    }
  }

  // Scheduled compliance monitoring
  async runScheduledMonitoring(): Promise<void> {
    try {
      console.log('Running scheduled compliance monitoring...');
      
      // This would typically:
      // 1. Query suppliers for compliance status
      // 2. Check for upcoming deadlines
      // 3. Analyze risk trends
      // 4. Generate alerts
      
      const monitoringPrompt = `Perform a comprehensive compliance monitoring check:
      1. Check all supplier compliance statuses
      2. Identify any suppliers at risk of losing compliance
      3. Check for upcoming compliance deadlines
      4. Analyze recent compliance trends
      5. Generate any necessary alerts
      
      Provide a detailed report with specific recommendations.`;
      
      const request: AgentRequest = {
        query: monitoringPrompt,
        context: {
          userId: 'system',
          organization: 'MedTech Corp',
          currentScreen: 'compliance-monitoring',
          sessionData: {},
        },
        agentType: 'compliance',
      };
      
      const response = await this.processRequest(request);
      console.log('Compliance monitoring completed:', response.response);
      
    } catch (error) {
      console.error('Error in scheduled compliance monitoring:', error);
    }
  }
}

export default ComplianceAgent; 