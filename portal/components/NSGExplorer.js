"use client";

import { useState } from "react";
import { Lock, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Play } from "lucide-react";

export default function NSGExplorer() {
  const [testIp, setTestIp] = useState("198.51.100.25");
  const [testPort, setTestPort] = useState(22);
  const [testResult, setTestResult] = useState(null);

  const rules = [
    { priority: 100, name: "AllowHTTPFromLoadBalancer", direction: "Inbound", access: "Allow", protocol: "TCP", port: "80", source: "AzureLoadBalancer", destination: "*" },
    { priority: 110, name: "AllowSSHFromManagement", direction: "Inbound", access: "Allow", protocol: "TCP", port: "22", source: "10.0.0.0/16", destination: "*" },
    { priority: 65000, name: "AllowVnetInbound", direction: "Inbound", access: "Allow", protocol: "*", port: "*", source: "VirtualNetwork", destination: "VirtualNetwork" },
    { priority: 65001, name: "AllowAzureLoadBalancerInbound", direction: "Inbound", access: "Allow", protocol: "*", port: "*", source: "AzureLoadBalancer", destination: "*" },
    { priority: 65500, name: "DenyAllInbound", direction: "Inbound", access: "Deny", protocol: "*", port: "*", source: "*", destination: "*" },
  ];

  const handleTestPacket = () => {
    let matchedRule = null;
    let allowed = false;

    if (Number(testPort) === 80 && (testIp.toLowerCase().includes("loadbalancer") || testIp.startsWith("168.63.129.16"))) {
      matchedRule = rules[0];
      allowed = true;
    } else if (Number(testPort) === 22 && testIp.startsWith("10.0.")) {
      matchedRule = rules[1];
      allowed = true;
    } else if (Number(testPort) === 22) {
      matchedRule = rules[4]; // DenyAllInbound
      allowed = false;
    } else {
      matchedRule = rules[4];
      allowed = false;
    }

    setTestResult({
      ip: testIp,
      port: testPort,
      allowed,
      rule: matchedRule.name,
      priority: matchedRule.priority,
      reason: allowed
        ? `Traffic allowed by explicit rule [${matchedRule.name}]`
        : `Traffic dropped by rule [${matchedRule.name}]. Non-management IP blocked from port ${testPort}.`,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* NSG Header */}
      <div
        className="glass-panel"
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "linear-gradient(135deg, rgba(0, 120, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0078d4, #00d2ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Network Security Group (vmss-nsg)</h3>
              <span className="badge badge-emerald">TFSec Audit Clean</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Enforcing Zero-Trust Access Control on Subnet <span className="code-font" style={{ color: "#00d2ff" }}>10.0.2.0/24</span>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <span className="badge badge-azure">2 Custom Rules</span>
          <span className="badge badge-emerald">0 Open Public Ports</span>
        </div>
      </div>

      {/* Grid: Rules Table and Simulator */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" }}>
        {/* Left: Active NSG Rules */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>
            Active Security Rules (Compiled from security.tf)
          </h4>

          <div style={{ overflowX: "auto" }}>
            <table style={{ fontSize: "0.8rem" }}>
              <thead>
                <tr>
                  <th>Pri</th>
                  <th>Name</th>
                  <th>Port</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r, i) => (
                  <tr key={i}>
                    <td className="code-font" style={{ color: "var(--text-muted)" }}>{r.priority}</td>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td className="code-font" style={{ color: "#00d2ff" }}>{r.port}</td>
                    <td className="code-font" style={{ color: r.source === "*" ? "#f43f5e" : "#10b981" }}>
                      {r.source}
                    </td>
                    <td>
                      <span className={`badge ${r.access === "Allow" ? "badge-emerald" : "badge-rose"}`}>
                        {r.access}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Traffic Simulator */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Play size={16} color="#00d2ff" />
            Firewall Packet Inspection Simulator
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Test whether an incoming IP packet will be admitted or dropped by the NSG rules:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Source IP Address:
              </label>
              <input
                type="text"
                value={testIp}
                onChange={(e) => setTestIp(e.target.value)}
                className="code-font"
                style={{
                  width: "100%",
                  background: "#05070c",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Destination Port:
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[22, 80, 443, 3389].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTestPort(p)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: "6px",
                      background: testPort === p ? "rgba(0, 120, 212, 0.25)" : "rgba(255, 255, 255, 0.05)",
                      border: testPort === p ? "1px solid #00d2ff" : "1px solid var(--border)",
                      color: testPort === p ? "#00d2ff" : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Port {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTestPacket}
              style={{
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #0078d4, #00d2ff)",
                border: "none",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Test Packet Inspection
            </button>
          </div>

          {/* Test Outcome Box */}
          {testResult && (
            <div
              style={{
                padding: "14px",
                borderRadius: "8px",
                background: testResult.allowed ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
                border: `1px solid ${testResult.allowed ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                {testResult.allowed ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <XCircle size={18} color="#f43f5e" />
                )}
                <strong style={{ fontSize: "0.9rem", color: testResult.allowed ? "#10b981" : "#f43f5e" }}>
                  {testResult.allowed ? "PACKET PERMITTED" : "PACKET DROPPED (BLOCKED)"}
                </strong>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {testResult.reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
