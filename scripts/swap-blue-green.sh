#!/bin/bash

# Swap Blue/Green target groups in ALB
# This script is called after successful green deployment

set -e

# Load parameters
BLUE_TG_ARN="${BLUE_TARGET_GROUP_ARN}"
GREEN_TG_ARN="${GREEN_TARGET_GROUP_ARN}"
LISTENER_ARN="${ALB_LISTENER_ARN}"

echo "Starting Blue/Green swap..."
echo "Blue Target Group: $BLUE_TG_ARN"
echo "Green Target Group: $GREEN_TG_ARN"

# Get current rule
CURRENT_RULE=$(aws elbv2 describe-rules \
  --listener-arn "$LISTENER_ARN" \
  --query "Rules[?Priority=='1'].RuleArn" \
  --output text)

echo "Current rule: $CURRENT_RULE"

# Swap the target groups by modifying the listener rule
aws elbv2 modify-rule \
  --rule-arn "$CURRENT_RULE" \
  --actions Type=forward,TargetGroupArn="$GREEN_TG_ARN"

echo "Successfully swapped Blue/Green target groups"
echo "Green is now the active production environment"

# Update tags to reflect new roles
aws elbv2 add-tags \
  --resource-arns "$GREEN_TG_ARN" \
  --tags Key=Environment,Value=blue Key=Status,Value=active

aws elbv2 add-tags \
  --resource-arns "$BLUE_TG_ARN" \
  --tags Key=Environment,Value=green Key=Status,Value=inactive

echo "Tags updated successfully"
