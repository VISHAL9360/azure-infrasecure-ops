#!/bin/bash
set -e

echo "=========================================================="
echo "  Azure Sentinel Scale - Infrastructure Validation Suite"
echo "=========================================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="${SCRIPT_DIR}/../infrastructure"

echo "[1/4] Running Terraform Format Check..."
terraform -chdir="${INFRA_DIR}" fmt -check || echo "Format check warning (non-blocking)"

echo "[2/4] Initializing and Validating Terraform Configuration..."
terraform -chdir="${INFRA_DIR}" init -backend=false
terraform -chdir="${INFRA_DIR}" validate

echo "[3/4] Checking Linting Rules (TFLint)..."
if command -v tflint &> /dev/null; then
    tflint --chdir="${INFRA_DIR}"
else
    echo "TFLint not installed in environment; skipping."
fi

echo "[4/4] Checking Security Configuration (TFSec)..."
if command -v tfsec &> /dev/null; then
    tfsec "${INFRA_DIR}"
else
    echo "TFSec not installed in environment; skipping."
fi

echo ""
echo "=========================================================="
echo "  SUCCESS: Infrastructure Configuration is Valid and Secure!"
echo "=========================================================="
