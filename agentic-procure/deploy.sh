#!/bin/bash

# Agentic ProCURE Deployment Script
# This script deploys the entire application to AWS

set -e

echo "🚀 Starting Agentic ProCURE deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Set variables
PROJECT_NAME="agentic-procure"
REGION=${AWS_REGION:-us-east-1}
STACK_NAME="${PROJECT_NAME}-stack"

echo "📋 Deployment Configuration:"
echo "  Project: $PROJECT_NAME"
echo "  Region: $REGION"
echo "  Stack: $STACK_NAME"

# Build the application
echo "🔨 Building application..."

# Build shared package
echo "  Building shared package..."
cd shared
npm run build
cd ..

# Build backend
echo "  Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "  Building frontend..."
cd frontend
npm run build
cd ..

# Build agents
echo "  Building agents..."
cd agents
npm run build
cd ..

echo "✅ Build completed successfully!"

# Deploy to AWS
echo "☁️  Deploying to AWS..."

# Create S3 bucket for deployment artifacts
BUCKET_NAME="${PROJECT_NAME}-deployment-$(date +%s)"
echo "  Creating deployment bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Upload deployment artifacts
echo "  Uploading deployment artifacts..."
aws s3 cp backend/dist s3://$BUCKET_NAME/backend/ --recursive
aws s3 cp frontend/build s3://$BUCKET_NAME/frontend/ --recursive
aws s3 cp agents/dist s3://$BUCKET_NAME/agents/ --recursive

# Deploy CloudFormation stack (if template exists)
if [ -f "cloudformation/template.yaml" ]; then
    echo "  Deploying CloudFormation stack..."
    aws cloudformation deploy \
        --template-file cloudformation/template.yaml \
        --stack-name $STACK_NAME \
        --parameter-overrides \
            ProjectName=$PROJECT_NAME \
            DeploymentBucket=$BUCKET_NAME \
        --capabilities CAPABILITY_IAM \
        --region $REGION
fi

# Deploy Lambda functions for agents
echo "  Deploying agent Lambda functions..."
cd agents

# Compliance Agent
echo "    Deploying Compliance Agent..."
aws lambda create-function \
    --function-name "${PROJECT_NAME}-compliance-agent" \
    --runtime nodejs18.x \
    --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
    --handler dist/compliance-agent.handler \
    --zip-file fileb://dist/compliance-agent.zip \
    --region $REGION \
    --timeout 30 \
    --memory-size 512 \
    --environment Variables="{AWS_REGION=$REGION}" || \
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-compliance-agent" \
    --zip-file fileb://dist/compliance-agent.zip \
    --region $REGION

# Product Requirements Agent
echo "    Deploying Product Requirements Agent..."
aws lambda create-function \
    --function-name "${PROJECT_NAME}-product-requirements-agent" \
    --runtime nodejs18.x \
    --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
    --handler dist/product-requirements-agent.handler \
    --zip-file fileb://dist/product-requirements-agent.zip \
    --region $REGION \
    --timeout 30 \
    --memory-size 512 \
    --environment Variables="{AWS_REGION=$REGION}" || \
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-product-requirements-agent" \
    --zip-file fileb://dist/product-requirements-agent.zip \
    --region $REGION

# Supplier Intelligence Agent
echo "    Deploying Supplier Intelligence Agent..."
aws lambda create-function \
    --function-name "${PROJECT_NAME}-supplier-intelligence-agent" \
    --runtime nodejs18.x \
    --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
    --handler dist/supplier-intelligence-agent.handler \
    --zip-file fileb://dist/supplier-intelligence-agent.zip \
    --region $REGION \
    --timeout 30 \
    --memory-size 512 \
    --environment Variables="{AWS_REGION=$REGION}" || \
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-supplier-intelligence-agent" \
    --zip-file fileb://dist/supplier-intelligence-agent.zip \
    --region $REGION

cd ..

# Deploy frontend to S3 (static hosting)
echo "  Deploying frontend to S3..."
aws s3 sync frontend/build s3://${PROJECT_NAME}-frontend --delete

# Configure S3 bucket for static website hosting
aws s3 website s3://${PROJECT_NAME}-frontend --index-document index.html --error-document index.html

# Create CloudFront distribution (optional)
echo "  Creating CloudFront distribution..."
aws cloudfront create-distribution \
    --distribution-config file://cloudformation/cloudfront-config.json || \
echo "    CloudFront distribution already exists or configuration file not found"

echo "✅ Deployment completed successfully!"

# Output deployment information
echo ""
echo "🎉 Agentic ProCURE has been deployed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  Frontend URL: http://${PROJECT_NAME}-frontend.s3-website-${REGION}.amazonaws.com"
echo "  Backend API: https://api.${PROJECT_NAME}.com (configure your domain)"
echo "  Lambda Functions:"
echo "    - Compliance Agent: ${PROJECT_NAME}-compliance-agent"
echo "    - Product Requirements Agent: ${PROJECT_NAME}-product-requirements-agent"
echo "    - Supplier Intelligence Agent: ${PROJECT_NAME}-supplier-intelligence-agent"
echo ""
echo "🔧 Next Steps:"
echo "  1. Configure your domain names"
echo "  2. Set up SSL certificates"
echo "  3. Configure environment variables"
echo "  4. Test the application"
echo "  5. Set up monitoring and logging"
echo ""
echo "📚 Documentation:"
echo "  - README.md for setup instructions"
echo "  - API documentation in /docs"
echo "  - Agent configuration in /agents" 