# Manual deployment script for testing
# Use this to manually trigger a deployment to test the pipeline

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendImage,
    
    [Parameter(Mandatory=$true)]
    [string]$FrontendImage,
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "staging"
)

Write-Host "Starting manual deployment..." -ForegroundColor Green
Write-Host "Backend Image: $BackendImage"
Write-Host "Frontend Image: $FrontendImage"
Write-Host "Environment: $Environment"

# Check if AWS CLI is configured
try {
    aws sts get-caller-identity | Out-Null
} catch {
    Write-Host "❌ AWS CLI not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Update ECS task definition
Write-Host "`nUpdating task definition..."

$taskDefJson = @{
    family = "coffee-tracker"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "512"
    memory = "1024"
    containerDefinitions = @(
        @{
            name = "backend"
            image = $BackendImage
            portMappings = @(
                @{
                    containerPort = 8080
                    protocol = "tcp"
                }
            )
            environment = @(
                @{ name = "SPRING_PROFILES_ACTIVE"; value = $Environment }
            )
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/coffee-tracker"
                    "awslogs-region" = "us-east-1"
                    "awslogs-stream-prefix" = "backend"
                }
            }
            healthCheck = @{
                command = @("CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1")
                interval = 30
                timeout = 5
                retries = 3
                startPeriod = 60
            }
        },
        @{
            name = "frontend"
            image = $FrontendImage
            portMappings = @(
                @{
                    containerPort = 80
                    protocol = "tcp"
                }
            )
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/coffee-tracker"
                    "awslogs-region" = "us-east-1"
                    "awslogs-stream-prefix" = "frontend"
                }
            }
        }
    )
} | ConvertTo-Json -Depth 10

# Register new task definition
$taskDefFile = "task-definition-temp.json"
$taskDefJson | Out-File -FilePath $taskDefFile -Encoding utf8

Write-Host "Registering task definition..."
$registerOutput = aws ecs register-task-definition --cli-input-json file://$taskDefFile | ConvertFrom-Json
$taskDefArn = $registerOutput.taskDefinition.taskDefinitionArn

Write-Host "✅ Task definition registered: $taskDefArn" -ForegroundColor Green

# Update ECS service
Write-Host "`nUpdating ECS service..."
aws ecs update-service `
    --cluster coffee-tracker-cluster `
    --service coffee-tracker-green `
    --task-definition $taskDefArn `
    --force-new-deployment

Write-Host "✅ Service update initiated" -ForegroundColor Green

# Wait for service to stabilize
Write-Host "`nWaiting for service to stabilize (this may take a few minutes)..."
aws ecs wait services-stable `
    --cluster coffee-tracker-cluster `
    --services coffee-tracker-green

Write-Host "✅ Deployment complete!" -ForegroundColor Green

# Clean up
Remove-Item $taskDefFile

Write-Host "`nNext steps:"
Write-Host "1. Check CloudWatch logs: /ecs/coffee-tracker"
Write-Host "2. Run health checks on the green environment"
Write-Host "3. If successful, shift traffic using: .\scripts\shift-traffic.ps1"
