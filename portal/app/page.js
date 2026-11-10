"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Server,
  DollarSign,
  Lock,
  Terminal,
  Layers,
  ChevronRight,
  ExternalLink,
  Activity,
  Globe,
  Sparkles,
} from "lucide-react";

import VMSSManager from "@/components/VMSSManager";
import SentinelHub from "@/components/SentinelHub";
import CostCalculator from "@/components/CostCalculator";
import NSGExplorer from "@/components/NSGExplorer";
import IaCPipeline from "@/components/IaCPipeline";

// Dynamically import Three.js Canvas to ensure client-only SSR bypass
const ThreeCloudCanvas = dynamic(() => import("@/components/ThreeCloudCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
      }}
    >
      Initializing 3D Azure Mesh...
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("topology");
  const [instanceCount, setInstanceCount] = useState(2);

  const tabs = [
    { id: "topology", label: "3D Mesh & VMSS", icon: Server },
    { id: "sentinel", label: "Sentinel SIEM", icon: Shield },
    { id: "security", label: "NSG Access Control", icon: Lock },
    { id: "cost", label: "Infracost Estimator", icon: DollarSign },
    { id: "pipeline", label: "IaC & Pipeline", icon: Terminal },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(7, 9, 14, 0.85)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0078d4 0%, #00d2ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(0, 120, 212, 0.45)",
              }}
            >
              <Shield size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Azure InfraSecure-Ops
                </h1>
                <span className="badge badge-azure" style={{ fontSize: "0.7rem" }}>
                  v2.0 Next.js
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Enterprise Cloud Ops, Automated Security & IaC Management
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="badge badge-emerald" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--emerald)",
                  boxShadow: "0 0 8px var(--emerald)",
                }}
              />
              Pipeline 100% Validated
            </div>

            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                background: "rgba(255, 255, 255, 0.05)",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              Region: <strong style={{ color: "#fff" }}>East US</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1400px", margin: "24px auto", padding: "0 28px", width: "100%", flex: 1 }}>
        {/* Hero Section with Interactive 3D Mesh */}
        <section
          className="glass-panel"
          style={{
            position: "relative",
            height: "380px",
            overflow: "hidden",
            marginBottom: "28px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            padding: 0,
          }}
        >
          {/* Hero Left Content */}
          <div
            style={{
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <Sparkles size={16} color="#00d2ff" />
              <span style={{ fontSize: "0.82rem", color: "#00d2ff", fontWeight: 700, textTransform: "uppercase" }}>
                Active Cloud Telemetry
              </span>
            </div>

            <h2 style={{ fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "12px" }}>
              Enterprise <span className="gradient-text">Azure VM Scale Set</span> & Sentinel SIEM
            </h2>

            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "520px", marginBottom: "24px" }}>
              Automated Zero-Trust security validation, real-time Infracost financial modeling, and dynamic autoscale orchestrator.
            </p>

            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                  ESTIMATED RUNTIME
                </span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>
                  ${(15.18 * (instanceCount / 2) + 14.02).toFixed(2)}/mo
                </span>
              </div>
              <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                  SECURITY SCORE
                </span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--emerald)" }}>
                  0 Vulnerabilities
                </span>
              </div>
              <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "20px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                  TARGET TOPOLOGY
                </span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#00d2ff" }}>
                  {instanceCount} VM Instances
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right: 3D Three.js Interactive Mesh */}
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <ThreeCloudCanvas />
          </div>
        </section>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "24px",
            paddingBottom: "8px",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: isActive ? "rgba(0, 120, 212, 0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(0, 210, 255, 0.4)" : "1px solid transparent",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} color={isActive ? "#00d2ff" : "var(--text-muted)"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "topology" && (
              <VMSSManager instanceCount={instanceCount} setInstanceCount={setInstanceCount} />
            )}
            {activeTab === "sentinel" && <SentinelHub />}
            {activeTab === "security" && <NSGExplorer />}
            {activeTab === "cost" && (
              <CostCalculator instanceCount={instanceCount} setInstanceCount={setInstanceCount} />
            )}
            {activeTab === "pipeline" && <IaCPipeline />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 28px",
          marginTop: "40px",
          background: "rgba(7, 9, 14, 0.95)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            Built with <strong>Next.js 16</strong>, <strong>Three.js</strong>, and <strong>Framer Motion</strong>
          </div>
          <div>
            Azure InfraSecure-Ops • Architected by Vishal K • 100% Terraform Verified
          </div>
        </div>
      </footer>
    </div>
  );
}
