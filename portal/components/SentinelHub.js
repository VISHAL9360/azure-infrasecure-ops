"use client";

import { useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, Play, Terminal, CheckCircle2, AlertTriangle, Search } from "lucide-react";

export default function SentinelHub() {
  const [selectedQuery, setSelectedQuery] = useState(
    `SecurityEvent\n| where EventID == 4625\n| summarize FailureCount = count() by TargetAccount, IpAddress\n| order by FailureCount desc`
  );
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [queryResults, setQueryResults] = useState([
    { TimeGenerated: "Just now", TargetAccount: "root", IpAddress: "198.51.100.42", Action: "DENIED", Rule: "AllowSSHFromManagement" },
    { TimeGenerated: "2m ago", TargetAccount: "admin", IpAddress: "203.0.113.15", Action: "DENIED", Rule: "AllowSSHFromManagement" },
    { TimeGenerated: "6m ago", TargetAccount: "azureuser", IpAddress: "198.51.100.89", Action: "DENIED", Rule: "AllowSSHFromManagement" },
  ]);

  const runQuery = () => {
    setIsRunningQuery(true);
    setTimeout(() => {
      setIsRunningQuery(false);
      setQueryResults([
        { TimeGenerated: "0.2s ago", TargetAccount: "root", IpAddress: "198.51.100.42", Action: "DENIED", Rule: "AllowSSHFromManagement" },
        { TimeGenerated: "1m ago", TargetAccount: "admin", IpAddress: "203.0.113.15", Action: "DENIED", Rule: "AllowSSHFromManagement" },
        { TimeGenerated: "4m ago", TargetAccount: "ubuntu", IpAddress: "192.0.2.77", Action: "DENIED", Rule: "AllowSSHFromManagement" },
        { TimeGenerated: "8m ago", TargetAccount: "azureuser", IpAddress: "198.51.100.89", Action: "DENIED", Rule: "AllowSSHFromManagement" },
      ]);
    }, 600);
  };

  const sampleQueries = [
    {
      label: "Blocked SSH Brute Force Attempts",
      code: `SecurityEvent\n| where EventID == 4625\n| summarize FailureCount = count() by TargetAccount, IpAddress\n| order by FailureCount desc`,
    },
    {
      label: "Azure Load Balancer Inbound Traffic",
      code: `AzureDiagnostics\n| where ResourceProvider == "MICROSOFT.NETWORK/LOADBALANCERS"\n| where Port == 80\n| project TimeGenerated, SourceIP, BackendPoolInstance`,
    },
    {
      label: "Autoscale Capacity Events",
      code: `AzureActivity\n| where OperationNameValue contains "Microsoft.Insights/autoscalesettings"\n| project TimeGenerated, ResourceGroup, ActivityStatusValue`,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Sentinel SIEM Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f46e5, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(168, 85, 247, 0.4)",
            }}
          >
            <Shield size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Microsoft Sentinel SIEM Operations</h3>
              <span className="badge badge-emerald">Active Guard</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "3px" }}>
              Workspace: <span className="code-font" style={{ color: "#a855f7" }}>azure-sentinel-scale-ws</span> • Connected to VMSS & NSG
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>INCIDENT RISK LEVEL</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10b981" }}>0 Active Breaches</span>
          </div>
        </div>
      </div>

      {/* Grid: Incident Triage & KQL Query Console */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left: Live Security Incidents Triage */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} color="#00d2ff" />
              Automated Incident Deflections
            </h4>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Live Stream</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981" }}>
                  ✔ Public SSH Connection Blocked
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>10s ago</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                IP <span className="code-font">198.51.100.42</span> probed Port 22. Dropped by rule{" "}
                <span className="code-font" style={{ color: "#00d2ff" }}>AllowSSHFromManagement</span>.
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(0, 120, 212, 0.08)",
                border: "1px solid rgba(0, 120, 212, 0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#00d2ff" }}>
                  ✔ HTTP Web Traffic Sanitized
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>2m ago</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Routed through Azure Standard Load Balancer backend pool to active instances.
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(168, 85, 247, 0.08)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a855f7" }}>
                  ✔ Disk Encryption Policy Compliant
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Verified</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                All VMSS instances verified with Standard_LRS managed storage encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Right: KQL Interactive Query Console */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={18} color="#a855f7" />
              Interactive KQL Query Console
            </h4>
            <button
              onClick={runQuery}
              disabled={isRunningQuery}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #4f46e5, #a855f7)",
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
              {isRunningQuery ? "Executing..." : "Run Query"}
            </button>
          </div>

          {/* Quick Query Pickers */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQuery(q.code)}
                style={{
                  padding: "4px 8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* KQL Code Box */}
          <textarea
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            rows={4}
            className="code-font"
            style={{
              width: "100%",
              background: "#05070c",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "10px 12px",
              color: "#38bdf8",
              fontSize: "0.8rem",
              resize: "none",
              marginBottom: "14px",
              outline: "none",
            }}
          />

          {/* Results Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ fontSize: "0.78rem" }}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Source IP</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "var(--text-muted)" }}>{r.TimeGenerated}</td>
                    <td className="code-font" style={{ color: "#fff" }}>{r.TargetAccount}</td>
                    <td className="code-font" style={{ color: "var(--azure-cyan)" }}>{r.IpAddress}</td>
                    <td>
                      <span className="badge badge-emerald">{r.Action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
