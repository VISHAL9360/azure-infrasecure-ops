#!/bin/bash
set -e

# Update package repository
apt-get update -y || yum update -y

# Install NGINX web server
apt-get install -y nginx || yum install -y nginx

# Enable and start NGINX
systemctl enable nginx
systemctl start nginx

# Generate dynamic enterprise health check & landing page
HOSTNAME=$(hostname)
IP_ADDR=$(hostname -I | awk '{print $1}')

cat <<EOF > /var/www/html/index.html
<!DOCTYPE html>
<html>
<head>
    <title>Azure Sentinel Scale - Enterprise VMSS</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; max-width: 500px; }
        h1 { color: #38bdf8; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 14px; }
        .badge { background: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 16px; }
        .metric { background: #0f172a; padding: 12px; border-radius: 8px; margin: 8px 0; font-family: monospace; font-size: 13px; color: #34d399; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">VMSS NODE HEALTHY</span>
        <h1>Azure Sentinel Scale</h1>
        <p>Enterprise Virtual Machine Scale Set with Automated Security & Auto-scaling</p>
        <div class="metric">Instance Hostname: ${HOSTNAME}</div>
        <div class="metric">Private Node IP: ${IP_ADDR}</div>
        <div class="metric">Load Balancer Probe: /health (HTTP 200)</div>
    </div>
</body>
</html>
EOF

# Health probe endpoint for Azure Load Balancer
mkdir -p /var/www/html/health
echo "OK" > /var/www/html/health/index.html

# Restart NGINX to apply configurations
systemctl restart nginx
