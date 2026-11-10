"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Activity, ArrowUpRight, Cpu, HardDrive, RefreshCw, Zap } from "lucide-react";

export default function VMSSManager({ instanceCount, setInstanceCount }) {
  const [cpuUsage, setCpuUsage] = useState(42);
  const [trafficRate, setTrafficRate] = useState(1280);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);

  // Live telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        if (isSimulatingSpike) return Math.min(88, prev + Math.floor(Math.random() * 5));
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.min(95, Math.max(15, prev + delta));
      });
      setTrafficRate((prev) => Math.max(400, prev + Math.floor(Math.random() * 80) - 40));
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulatingSpike]);

  // Autoscale trigger effect
  useEffect(() => {
    if (cpuUsage > 75 && instanceCount < 5) {
      const timeout = setTimeout(() => {
        setInstanceCount((prev) => Math.min(5, prev + 1));
      }, 1500);
      return () => clearTimeout(timeout);
    } else if (cpuUsage < 25 && instanceCount > 2) {
      const timeout = setTimeout(() => {
        setInstanceCount((prev) => Math.max(2, prev - 1));
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [cpuUsage, instanceCount, setInstanceCount]);

  const toggleSpike = () => {
    if (!isSimulatingSpike) {
      setIsSimulatingSpike(true);
      setCpuUsage(82);
    } else {
      setIsSimulatingSpike(false);
      setCpuUsage(38);
    }
  };

  const instances = Array.from({ length: instanceCount }, (_, i) => ({
    id: `vmss-vmss_${i}`,
    name: `Instance #${i + 1}`,
    ip: `10.0.2.${4 + i}`,
    publicIp: "20.120.45.18",
    status: "Healthy",
    cpu: Math.max(12, Math.min(95, cpuUsage + (i % 2 === 0 ? -4 : 5))),
    ram: "1.4 / 2.0 GB",
    disk: "S4 Managed (32 GB)",
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Controller Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <Server size={20} color="#00d2ff" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Azure VM Scale Set Controller</h3>
            <span className="badge badge-azure">Standard_B1s</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            East US • Canonical Ubuntu 22.04 LTS Gen2 • Autoscaling Min: 2, Max: 5
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={toggleSpike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: isSimulatingSpike
                ? "linear-gradient(135deg, #f43f5e, #e11d48)"
                : "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "white",
              borderRadius: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Zap size={15} color={isSimulatingSpike ? "#fff" : "#f59e0b"} />
            {isSimulatingSpike ? "Spike Active (>75% CPU)" : "Simulate CPU Spike"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Instances:</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#00d2ff" }}>
              {instanceCount}
            </span>
          </div>
        </div>
      </div>

      {/* Realtime Telemetry Sparks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="glass-panel" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "8px" }}>
            <span>CLUSTER CPU LOAD</span>
            <Activity size={16} color={cpuUsage > 75 ? "#f43f5e" : "#10b981"} />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: cpuUsage > 75 ? "#f43f5e" : "#fff" }}>
            {cpuUsage}%
          </div>
          <div style={{ fontSize: "0.75rem", color: cpuUsage > 75 ? "#f43f5e" : "var(--emerald)", marginTop: "4px" }}>
            {cpuUsage > 75 ? "⚠️ Above 75% Scale-out threshold" : "✔ Normal utilization (Target 25-75%)"}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "8px" }}>
            <span>REQUESTS / MINUTE</span>
            <ArrowUpRight size={16} color="#00d2ff" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            {trafficRate.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#00d2ff", marginTop: "4px" }}>
            Distributed by Standard Load Balancer
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "8px" }}>
            <span>ACTIVE HEALTH PROBE</span>
            <RefreshCw size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981" }}>
            100% UP
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            TCP Port 80 • 15s Interval
          </div>
        </div>
      </div>

      {/* VM Scale Set Instance Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        <AnimatePresence>
          {instances.map((vm, index) => (
            <motion.div
              key={vm.id}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="glass-panel"
              style={{ padding: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                    }}
                  >
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{vm.name}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{vm.id}</span>
                  </div>
                </div>
                <span className="badge badge-emerald">Healthy</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                  <span>Private Subnet IP:</span>
                  <span className="code-font" style={{ color: "var(--text-primary)" }}>{vm.ip}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                  <span>Public Endpoint:</span>
                  <span className="code-font" style={{ color: "#00d2ff" }}>vmss-dns.eastus...</span>
                </div>

                {/* Progress bar for CPU */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Instance CPU</span>
                    <span style={{ fontWeight: 600 }}>{vm.cpu}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${vm.cpu}%`,
                        height: "100%",
                        background: vm.cpu > 75 ? "#f43f5e" : "linear-gradient(90deg, #0078d4, #00d2ff)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
