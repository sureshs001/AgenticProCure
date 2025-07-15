#!/usr/bin/env node

/**
 * Test script to verify the application works without AWS dependencies
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Testing AgenticProCure without AWS dependencies...\n');

// Set environment to development to use mock services
process.env.NODE_ENV = 'development';
process.env.API_KEY = 'test-api-key-123';

try {
  // Test 1: Build all modules
  console.log('1. Testing build process...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Build successful\n');

  // Test 2: Import and test services
  console.log('2. Testing service imports...');
  const { services, MockLLMService } = require('./shared/dist');
  console.log('✅ Services imported successfully');
  console.log(`   - LLM Service: ${services.llm.constructor.name}`);
  console.log(`   - Database Service: ${services.database.constructor.name}`);
  console.log(`   - File Storage Service: ${services.fileStorage.constructor.name}`);
  console.log(`   - Function Service: ${services.functions.constructor.name}\n`);

  // Test 3: Test LLM service
  console.log('3. Testing LLM service...');
  services.llm.invoke({
    modelId: 'test-model',
    prompt: 'What are the compliance requirements for ISO 13485?',
    temperature: 0.7,
    maxTokens: 1000
  }).then(response => {
    console.log('✅ LLM service test successful');
    console.log(`   Response length: ${response.content.length} characters`);
    console.log(`   Usage: ${JSON.stringify(response.usage)}\n`);

    // Test 4: Test database service
    console.log('4. Testing database service...');
    return services.database.put('test-table', {
      id: 'test-1',
      data: 'test data',
      timestamp: new Date().toISOString()
    });
  }).then(() => {
    console.log('✅ Database service test successful\n');

    // Test 5: Test ComplianceAgent
    console.log('5. Testing ComplianceAgent...');
    const { ComplianceAgent } = require('./agents/dist/compliance-agent');
    const agent = new ComplianceAgent();
    
    return agent.processRequest({
      query: 'What are the key requirements for ISO 13485 compliance?',
      context: {
        userId: 'test-user',
        organization: 'Test Corp',
        currentScreen: 'compliance',
        sessionData: {}
      },
      agentType: 'compliance'
    });
  }).then(response => {
    console.log('✅ ComplianceAgent test successful');
    console.log(`   Response ID: ${response.id}`);
    console.log(`   Confidence: ${response.confidence}`);
    console.log(`   Sources: ${response.sources.join(', ')}\n`);

    console.log('🎉 All tests passed! The application works without AWS dependencies.');
    console.log('\n📝 To run the application:');
    console.log('   Frontend: npm run dev:frontend');
    console.log('   Backend:  npm run dev:backend');
    console.log('   Full dev: npm run dev');
  }).catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}