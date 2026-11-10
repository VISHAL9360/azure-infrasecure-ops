"use client";

import { useState } from "react";
import { Terminal, CheckCircle2, Play, Copy, Check, FileCode } from "lucide-react";
import confetti from "canvas-confetti";

export default function IaCPipeline() {
  const [activeFile, setActiveFile] = useState("security.tf");
  const [isCopied, setIsCopied] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState([
    "PS C:\\azure-infrasecure-ops> .\\scripts\\validate.sh",
    "[1/5] Initializing & Validating Terraform...  Success! Configuration is valid.",
    "[2/5] Running TFLint...  TFLint passed successfully.",
    "[3/5] Running TFSec Audit...  0 vulnerabilities found (SARIF clean).",
    "[4/5] Running Infracost...  Estimated monthly baseline: $29.21 USD.",
    "[5/5] Generating Architecture Plan...  11 resources planned for deployment.",
    "==========================================================",
    " Status: 100% Validated - Enterprise Compliance Ready",
    "==========================================================",
  ]);

  const files = {
    "security.tf": `resource "azurerm_network_security_group" "main" {
  name                = "\${var.prefix}-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowHTTPFromLoadBalancer"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = var.application_port
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowSSHFromManagement"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = 22
    source_address_prefix      = var.admin_source_address_prefix
    destination_address_prefix = "*"
  }
}`,
    "main.tf": `resource "azurerm_linux_virtual_machine_scale_set" "main" {
  name                = "\${var.prefix}-vmss"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.vm_sku
  instances           = var.instance_count
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  disable_password_authentication = false

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  os_disk {
    storage_account_type = "Standard_LRS"
    caching              = "ReadWrite"
  }
}`,
    "variable.tf": `variable "prefix" {
  type    = string
  default = "vmss"
}

variable "location" {
  type    = string
  default = "East US"
}

variable "admin_source_address_prefix" {
  type        = string
  description = "CIDR allowed to SSH. Defaults to internal VNet."
  default     = "10.0.0.0/16"
}`,
  };

  const runSimulation = () => {
    setIsRunningPipeline(true);
    setPipelineLogs(["Starting Azure InfraSecure-Ops Validation Pipeline..."]);

    const steps = [
      "[1/5] Initializing Terraform backend & providers (azurerm v3.117.1)...",
      " TerraForm configuration is valid and healthy!",
      "[2/5] Running TFLint deep analysis against Azure WAF best practices...",
      " TFLint passed: 0 warnings.",
      "[3/5] Running TFSec compliance scan on NSG and VM Scale Set...",
      " TFSec Scan Passed: 0 vulnerabilities found! Reports saved to SARIF.",
      "[4/5] Running Infracost cost modeling on 11 resources...",
      " Infracost: Total monthly estimate calculated: $29.21 USD.",
      "[5/5] Compiling Terraform Architecture Plan...",
      " Verified Architecture Plan loaded (11 resources ready to deploy).",
      "==========================================================",
      " Status: 100% Validated - 0 Critical Vulnerabilities",
      "==========================================================",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setPipelineLogs((prev) => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsRunningPipeline(false);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0078d4", "#00d2ff", "#10b981"],
        });
      }
    }, 350);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(files[activeFile]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Grid: Terminal Runner and Code Explorer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left: Terminal Output Runner */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={18} color="#00d2ff" />
              PowerShell Validation Runner
            </h4>
            <button
              onClick={runSimulation}
              disabled={isRunningPipeline}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #0078d4, #00d2ff)",
                border: "none",
                color: "white",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Play size={13} />
              {isRunningPipeline ? "Running Pipeline..." : "Execute validate.ps1"}
            </button>
          </div>

          <div
            className="code-font"
            style={{
              height: "360px",
              background: "#05070c",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "0.78rem",
              lineHeight: 1.6,
              overflowY: "auto",
              color: "#e2e8f0",
            }}
          >
            {pipelineLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  color: log.includes("Success") || log.includes("Passed") || log.includes("100%")
                    ? "#10b981"
                    : log.includes("[")
                    ? "#00d2ff"
                    : "#cbd5e1",
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {Object.keys(files).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFile(f)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: activeFile === f ? "rgba(0, 120, 212, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    border: activeFile === f ? "1px solid #00d2ff" : "1px solid var(--border)",
                    color: activeFile === f ? "#00d2ff" : "var(--text-secondary)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre
            className="code-font"
            style={{
              height: "360px",
              background: "#05070c",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              overflowY: "auto",
              color: "#38bdf8",
            }}
          >
            {files[activeFile]}
          </pre>
        </div>
      </div>
    </div>
  );
}
