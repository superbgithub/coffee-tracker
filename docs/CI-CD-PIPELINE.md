# CI/CD Pipeline Documentation

## Overview

This project uses **GitHub Actions** for continuous integration and **Spinnaker** for continuous deployment with Blue/Green deployment strategy.

## Pipeline Flow

```
Git Push → GitHub Actions → Build & Test → Security Scan → Build Images → Push to ECR → Trigger Spinnaker → Blue/Green Deploy
```

## Prerequisites

### 1. AWS Setup
- AWS account with appropriate permissions
- AWS CLI installed and configured: `aws configure`
- ECR repositories created:
  ```bash
  aws ecr create-repository --repository-name coffee-tracker-backend
  aws ecr create-repository --repository-name coffee-tracker-frontend
  ```

### 2. GitHub Secrets
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AWS_ACCESS_KEY_ID` | AWS access key | IAM Console → Users → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Same as above |
| `AWS_REGION` | AWS region | e.g., `us-east-1` |
| `SPINNAKER_WEBHOOK_URL` | Spinnaker webhook | Spinnaker → Applications → Webhooks |

### 3. Spinnaker Setup
- Spinnaker installed and configured
- AWS provider configured in Spinnaker
- Import pipeline: `spin pipeline save --file .spinnaker/pipeline-bluegreen.json`

## GitHub Actions Workflow

### Trigger Events
- **Push to main/develop**: Full CI/CD pipeline
- **Pull Request**: Build and test only (no deployment)

### Jobs

#### 1. Build and Test
- Builds backend with Maven (Java 17)
- Builds frontend with npm (Node 18)
- Runs unit tests
- Uploads artifacts

#### 2. Security Scan
- Runs Trivy vulnerability scanner
- Uploads results to GitHub Security tab

#### 3. Build and Push Images (main branch only)
- Downloads build artifacts
- Builds Docker images
- Tags with timestamp and commit SHA
- Pushes to Amazon ECR
- Triggers Spinnaker pipeline

### Image Tagging Strategy
- Format: `YYYYMMDD-HHMMSS-<7-char-sha>`
- Example: `20241128-143022-a1b2c3d`
- Also tagged as `latest`

## Spinnaker Blue/Green Pipeline

### Stages

1. **Deploy to Green Environment** - Deploy new version to inactive (green) environment
2. **Wait for Health** - Wait 2 minutes for containers to start
3. **Health Check** - Verify green environment passes health checks
4. **Manual Judgment** - Human approval to proceed (optional: can be automated)
5. **Shift 10% Traffic** - Start canary deployment
6. **Monitor** - Wait 5 minutes and check metrics
7. **Check Metrics** - Automated canary analysis with Kayenta
8. **Shift 50% Traffic** - Increase traffic gradually
9. **Monitor** - Wait 10 minutes
10. **Shift 100% Traffic** - Complete the switch
11. **Swap Blue/Green Labels** - Green becomes new Blue
12. **Terminate Old Blue** - Clean up previous version
13. **Send Notification** - Success notification via SNS

### Pipeline Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `BACKEND_IMAGE` | Backend Docker image with tag | `123456.dkr.ecr.us-east-1.amazonaws.com/coffee-tracker-backend:20241128-143022-a1b2c3d` |
| `FRONTEND_IMAGE` | Frontend Docker image with tag | Same format |
| `COMMIT_SHA` | Git commit SHA | `a1b2c3d4e5f6...` |
| `BLUE_TARGET_GROUP_ARN` | ARN of blue target group | From Terraform output |
| `GREEN_TARGET_GROUP_ARN` | ARN of green target group | From Terraform output |
| `ALB_LISTENER_ARN` | ALB listener ARN | From Terraform output |

## Manual Deployment

For testing or emergency deployments:

```powershell
# Deploy specific images
.\scripts\manual-deploy.ps1 `
    -BackendImage "123456.dkr.ecr.us-east-1.amazonaws.com/coffee-tracker-backend:latest" `
    -FrontendImage "123456.dkr.ecr.us-east-1.amazonaws.com/coffee-tracker-frontend:latest" `
    -Environment "staging"
```

## Rollback Procedure

### Automatic Rollback
- Spinnaker automatically rolls back if health checks fail
- Canary analysis failures trigger rollback

### Manual Rollback
If issues are detected in production:

```bash
# Linux/Mac
export BLUE_TARGET_GROUP_ARN="arn:aws:elasticloadbalancing:..."
export GREEN_TARGET_GROUP_ARN="arn:aws:elasticloadbalancing:..."
export ALB_LISTENER_ARN="arn:aws:elasticloadbalancing:..."
export SNS_TOPIC_ARN="arn:aws:sns:..."

./scripts/rollback.sh
```

```powershell
# Windows PowerShell
$env:BLUE_TARGET_GROUP_ARN="arn:aws:elasticloadbalancing:..."
$env:GREEN_TARGET_GROUP_ARN="arn:aws:elasticloadbalancing:..."
$env:ALB_LISTENER_ARN="arn:aws:elasticloadbalancing:..."
$env:SNS_TOPIC_ARN="arn:aws:sns:..."

bash scripts/rollback.sh
```

## Monitoring

### CloudWatch Logs
- Backend logs: `/ecs/coffee-tracker/backend`
- Frontend logs: `/ecs/coffee-tracker/frontend`

### Metrics to Monitor
- ECS task health status
- ALB target health
- Response time (p50, p95, p99)
- Error rate
- CPU and memory utilization

### Alerts
Configured in Terraform:
- High error rate (>5%)
- High latency (p95 >500ms)
- Container health check failures
- Task stopped unexpectedly

## Troubleshooting

### Build Failures

**Maven build fails**
```bash
# Check Java version
java -version  # Should be 17

# Clean and rebuild
mvn clean install -U
```

**npm build fails**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### ECR Push Failures

**Authentication error**
```bash
# Re-authenticate with ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456.dkr.ecr.us-east-1.amazonaws.com
```

### Deployment Failures

**Task fails to start**
1. Check CloudWatch logs for errors
2. Verify environment variables and secrets
3. Check security group allows traffic
4. Verify IAM role has correct permissions

**Health checks failing**
1. Check backend health endpoint: `curl http://backend:8080/actuator/health`
2. Verify database connectivity
3. Check security groups and network ACLs

### Spinnaker Issues

**Pipeline not triggered**
1. Check GitHub Actions webhook output
2. Verify Spinnaker webhook URL is correct
3. Check Spinnaker logs: `kubectl logs -n spinnaker svc/spin-gate`

**Manual judgment stuck**
1. Open Spinnaker UI
2. Navigate to pipeline execution
3. Click "Continue" or "Rollback"

## Best Practices

### Before Deployment
- ✅ All tests passing locally
- ✅ Code reviewed and approved
- ✅ Database migrations tested
- ✅ Staging environment validated

### During Deployment
- 👀 Monitor CloudWatch metrics
- 👀 Watch error rates during traffic shift
- 👀 Check logs for exceptions
- 👀 Have rollback plan ready

### After Deployment
- ✅ Verify all features working
- ✅ Check monitoring dashboards
- ✅ Review logs for warnings
- ✅ Document any issues

## Security Considerations

- Store secrets in AWS Secrets Manager, not environment variables
- Use least-privilege IAM roles
- Enable VPC Flow Logs
- Regular security scanning with Trivy
- Keep dependencies updated

## Cost Optimization

- Use Fargate Spot for non-production environments
- Enable ECS Service Auto Scaling
- Schedule non-prod environments to stop at night
- Use CloudWatch Log retention policies
- Clean up old ECR images

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review Spinnaker pipeline execution
3. Check GitHub Actions run logs
4. Review this documentation

## Next Steps

1. Test local application: `docker-compose up`
2. Set up AWS infrastructure: `terraform apply`
3. Configure GitHub secrets
4. Push to main branch to trigger pipeline
5. Monitor deployment in Spinnaker UI
