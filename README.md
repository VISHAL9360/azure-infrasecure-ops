# 🛡️ Azure InfraSecure-Ops
### Enterprise-Grade Azure VM Scale Set (VMSS), Zero-Trust Network Perimeter, FinOps Cost Optimization & Interactive Management Portal

[![Terraform](https://img.shields.io/badge/Terraform-1.0%2B-623CE4.svg?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Azure](https://img.shields.io/badge/Microsoft_Azure-Cloud_Infrastructure-0089D6.svg?logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Security: tfsec](https://img.shields.io/badge/Security-tfsec_Audited-00C7B7.svg)](https://aquasecurity.github.io/tfsec/)
[![FinOps: Infracost](https://img.shields.io/badge/FinOps-Infracost_Optimized-059669.svg)](https://www.infracost.io/)
[![Next.js Portal](https://img.shields.io/badge/Next.js-16_Turbopack-000000.svg?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Vishal_K-blue.svg)](https://github.com/VISHAL9360)

---

## Executive Summary

**Azure InfraSecure-Ops** is a production-hardened cloud platform engineering solution that deploys, secures, monitors, and optimizes a scalable microservices compute cluster on **Microsoft Azure**.

Engineered following enterprise DevSecOps and FinOps standards, the repository couples **Infrastructure as Code (Terraform)** with **automated security governance (`tfsec` / `tflint`)**, predictive cost optimization (**Infracost** baseline at **$29.21/month**), and an interactive **Next.js 16 / React 19 + Three.js 3D Management Portal** with real-time telemetry.

```
                              [ Internet Users / API Clients ]
                                             │
                                             ▼
                               [ Azure Public IP (Standard) ]
                                             │
                                             ▼
                       [ Azure Load Balancer (Standard SKU) ]
                                 │ Health Probe (/health)
               ┌─────────────────┴─────────────────┐
               ▼                                   ▼
 ┌───────────────────────────┐       ┌───────────────────────────┐
 │ Subnet: 10.0.2.0/24       │       │ Network Security Group    │
 │ (Dedicated Web Tier)      │       │ - Port 80: ALB Only       │
 │                           │       │ - Port 22: Mgmt CIDR Only │
 └─────────────┬─────────────┘       └─────────────┬─────────────┘
               │                                   │
               ▼                                   ▼
 ┌───────────────────────────────────────────────────────────────┐
 │           Azure Linux Virtual Machine Scale Set (VMSS)         │
 │   - Ubuntu 22.04 LTS Gen2 (Standard_B1s Burstable)            │
 │   - Cloud-Init Nginx Microservice (/health endpoints)         │
 │   - Auto-scaling Policy: Scale-Out > 75% | Scale-In < 25%     │
 │   - Dynamic Elasticity: Min 2, Max 5 Instances                │
 └───────────────────────────────────────────────────────────────┘
```

---

## Architecture & System Design

### 1. Zero-Trust Network Perimeter & Ingress Tier
- **Azure Virtual Network (`10.0.0.0/16`)** with isolated subnets separating ingress, application compute, and management planes.
- **Dedicated Web Subnet (`10.0.2.0/24`)** shielded with an enterprise Network Security Group (NSG):
  - **Inbound HTTP (Port 80)**: Restricted exclusively to traffic originating from the `AzureLoadBalancer` service tag. Direct public ingress to instances is forbidden.
  - **Inbound SSH (Port 22)**: Restricted strictly to designated administrative corporate CIDR blocks (`var.mgmt_ip`).
  - **Egress Filtering**: Outbound connectivity is strictly bounded to authorized repository mirrors and package distribution endpoints.
- **Azure Standard Load Balancer**:
  - High-availability Layer 4 reverse proxy with a static Standard Public IP.
  - Active HTTP health probe on endpoint `GET /health` with a 5-second interval and 2 consecutive failure thresholds before automatic node eviction.

### 2. Elastic Compute: Linux VM Scale Set (VMSS)
- **Engineered on Ubuntu 22.04 LTS (Gen2 Virtualization)** utilizing cost-effective burstable `Standard_B1s` instances.
- **Automated Bootstrap via Cloud-Init**:
  - Automatically provisions and configures Nginx, mounts application runtimes, and serves a dedicated `/health` endpoint.
- **Metric-Driven Reactive Auto-Scaling (`azurerm_monitor_autoscale_setting`)**:
  - **Scale-Out Trigger**: Average CPU utilization $\ge 75\%$ over 5 minutes $\rightarrow$ dynamically spawns $+1$ instance (cooldown: 5 min).
  - **Scale-In Trigger**: Average CPU utilization $\le 25\%$ over 5 minutes $\rightarrow$ gracefully terminates $-1$ instance (cooldown: 5 min).
  - **Capacity Safeguards**: Hard minimum bounded at **2 instances** (guaranteeing high availability across fault domains) up to a maximum bounded burst of **5 instances**.

### 3. FinOps & Cost Engineering (Infracost Certified)
Through automated FinOps auditing via Infracost, compute and networking components are optimized for extreme capital efficiency without sacrificing resilience:

| Resource Type | SKU / Spec | Monthly Cost (USD) | Strategy |
| :--- | :--- | :--- | :--- |
| **VMSS Compute (2 Nodes)** | `Standard_B1s` (1 vCPU, 1GB RAM) | **$15.18** | Burstable B-series credits |
| **OS Disks (2 Disks)** | Standard SSD (30GB LRS) | **$3.08** | LRS durability |
| **Azure Load Balancer** | Standard SKU (Data Processing) | **$10.59** | Layer 4 zero-latency routing |
| **Standard Public IP** | Static Ingress IPv4 | **$0.36** | High-availability IP allocation |
| **Total Baseline TCO** | **Complete High-Availability Stack** | **$29.21 / mo** | **FinOps Optimized** |

### 4. DevSecOps Security Matrix & Policy As Code
- **`tfsec` Static Analysis**: Validated against CIS Microsoft Azure Foundations Benchmark.
- **`tflint` Rule Enforcement**: Syntax and Azure naming standard adherence verified.
- **Zero Hardcoded Secrets**: SSH keys injected dynamically through variable definitions or Azure Key Vault references.

---

## Interactive Cloud Management Portal & Dashboard

The repository includes two enterprise monitoring interfaces:

1. **Next.js 16 + React 19 Management Portal (`/portal`)**:
   - Modern glassmorphic WebGL interface powered by **Three.js** and **Framer Motion**.
   - **Interactive VMSS Manager**: Real-time simulated load testing, manual capacity adjustments, and node status indicators.
   - **Dynamic FinOps Cost Calculator**: Sliders for instance count, storage tier, and region with instant monthly TCO estimation.
   - **Live NSG Firewall Visualizer**: Visual rule builder showing permitted vs dropped packets based on CIDR matching.
   - **IaC Pipeline Status**: Live checklist verifying Terraform linting, security scans, and infrastructure state.

2. **Standalone Operations Dashboard (`dashboard.html`)**:
   - Zero-dependency, offline-capable single-file dashboard for operational engineers.

---

## Project Structure

```
azure-infrasecure-ops/
├── infrastructure/               # Terraform Infrastructure as Code
│   ├── provider.tf               # AzureRM provider configuration (~> 3.0)
│   ├── main.tf                   # VM Scale Set (VMSS) resource definitions
│   ├── network.tf                # VNet, Subnet, and Public IP
│   ├── loadbalancer.tf           # Azure Standard Load Balancer, Rules, Probes
│   ├── security.tf               # Network Security Group (NSG) and Zero-Trust ACLs
│   ├── autoscale.tf              # Metric alert rules and autoscale scale-in/out logic
│   ├── variable.tf               # Variable parameters and environment overrides
│   ├── output.tf                 # Exported IP addresses, FQDNs, and resource IDs
│   ├── tflint.hcl                # TFLint configuration for Azure
│   └── tfplan.json               # Pre-compiled execution plan for inspection
├── cost-optimization/            # FinOps telemetry and auditing
│   └── infracost-breakdown.txt   # Line-item Infracost cost analysis
├── portal/                       # Next.js 16 + React 19 + Three.js Portal
│   ├── app/                      # Next.js App Router (layout, page, styles)
│   ├── components/               # ThreeCloudCanvas, VMSSManager, CostCalculator, etc.
│   └── package.json              # Portal dependencies and build scripts
├── scripts/                      # Bootstrap and operational utilities
│   ├── install_nginx.sh          # Cloud-Init script for VMSS instances
│   └── validate.sh               # Terraform & security validation runner
├── dashboard.html                # Zero-dependency operations dashboard
├── .tfsec.yml                    # Security scanning configuration
├── .gitignore                    # Production Git exclusions
└── README.md                     # Comprehensive technical documentation
```

---

## Quickstart & Operational Guide

### Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/downloads) $\ge 1.0.0$
- [Azure CLI (`az`)](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) logged into an active Azure subscription
- [Node.js](https://nodejs.org/) $\ge 18.0.0$ (for the interactive portal)

### 1. Terraform Deployment

```bash
# Navigate to the infrastructure directory
cd infrastructure

# Initialize provider plugins
terraform init

# Validate configuration syntax and policies
terraform validate

# Review planned modifications
terraform plan -out=tfplan

# Apply and provision infrastructure to Azure
terraform apply tfplan
```

### 2. Validate Health & Endpoints
Once applied, Terraform outputs the Load Balancer Public IP address:
```bash
# Query the health probe through the Azure Load Balancer
curl -I http://<LOAD_BALANCER_PUBLIC_IP>/health

# Expected response:
# HTTP/1.1 200 OK
```

### 3. Launch the Management Portal
```bash
# Navigate to the portal directory
cd portal

# Install dependencies (first time only)
npm install

# Start development server with Turbopack
npm run dev
# Open http://localhost:3000 in your browser
```

---

## Verification & Test Results

```
$ terraform validate
Success! The configuration is valid.

$ npm run build (in /portal)
✓ Compiled successfully in 6.0s (Turbopack)
✓ Generating static pages (5/5)
✓ Finalizing page optimization
```

---

## License & Author

- **Author**: [Vishal K](https://github.com/VISHAL9360)
- **Repository**: [https://github.com/VISHAL9360/azure-infrasecure-ops](https://github.com/VISHAL9360/azure-infrasecure-ops)
- **License**: MIT
