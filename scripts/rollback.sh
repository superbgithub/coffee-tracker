#!/bin/bash

# Rollback to previous (blue) environment
# This script can be run manually if issues are detected

set -e

BLUE_TG_ARN="${BLUE_TARGET_GROUP_ARN}"
GREEN_TG_ARN="${GREEN_TARGET_GROUP_ARN}"
LISTENER_ARN="${ALB_LISTENER_ARN}"

echo "⚠️  ROLLBACK: Shifting 100% traffic back to Blue environment"

# Get listener rules
RULE_ARN=$(aws elbv2 describe-rules \
  --listener-arn "$LISTENER_ARN" \
  --query "Rules[?Priority=='1'].RuleArn" \
  --output text)

# Shift all traffic back to blue
aws elbv2 modify-rule \
  --rule-arn "$RULE_ARN" \
  --actions Type=forward,TargetGroupArn="$BLUE_TG_ARN"

echo "✅ Rollback complete. All traffic is now on Blue environment"

# Send notification
aws sns publish \
  --topic-arn "${SNS_TOPIC_ARN}" \
  --subject "Coffee Tracker - Rollback Executed" \
  --message "Traffic has been rolled back to the blue environment at $(date)"

# Scale down green environment
aws ecs update-service \
  --cluster coffee-tracker-cluster \
  --service coffee-tracker-green \
  --desired-count 0

echo "Green environment scaled to 0 tasks"
