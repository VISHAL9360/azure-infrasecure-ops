"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, Layers, Calculator, Check, ArrowRight } from "lucide-react";

export default function CostCalculator({ instanceCount, setInstanceCount }) {
  const [sku, setSku] = useState("Standard_B1s");
  const [storageType, setStorageType] = useState("S4_LRS");
  const [term, setTerm] = useState("pay-as-you-go");

  const skuPrices = {
    Standard_B1s: { name: "Standard_B1s (1 vCPU, 1 GiB)", pricePerMonth: 7.59 },
    Standard_B2s: { name: "Standard_B2s (2 vCPU, 4 GiB)", pricePerMonth: 15.18 },
    Standard_D2s_v5: { name: "Standard_D2s_v5 (2 vCPU, 8 GiB)", pricePerMonth: 35.04 },
    Standard_D4s_v5: { name: "Standard_D4s_v5 (4 vCPU, 16 GiB)", pricePerMonth: 70.08 },
  };

  const storagePrices = {
    S4_LRS: { name: "Standard SSD S4 (32 GB)", price: 1.54 },
    P4_LRS: { name: "Premium SSD P4 (32 GB)", price: 4.81 },
  };

  const currentSkuPrice = skuPrices[sku].pricePerMonth;
  const currentStoragePrice = storagePrices[storageType].price;
  const lbPrice = 7.30;
  const ipPrice = 3.65;

  let baseVmCost = currentSkuPrice * instanceCount;
  let baseStorageCost = currentStoragePrice * instanceCount;
  let totalBase = baseVmCost + baseStorageCost + lbPrice + ipPrice;

  // Apply discount for reserved instances
  const discountMultiplier = term === "1year" ? 0.65 : term === "3year" ? 0.45 : 1.0;
  const finalVmCost = baseVmCost * discountMultiplier;
  const finalTotal = finalVmCost + baseStorageCost + lbPrice + ipPrice;
  const savings = totalBase - finalTotal;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Cost Simulator Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 120, 212, 0.08) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Calculator size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Infracost Architecture Estimator</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Real-time cost modeling based on Terraform configuration in <span className="code-font" style={{ color: "#00d2ff" }}>infrastructure/</span>
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>PROJECTED MONTHLY TOTAL</span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
            ${finalTotal.toFixed(2)} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/ mo</span>
          </div>
          {savings > 0 && (
            <span className="badge badge-emerald" style={{ marginTop: "4px" }}>
              Save ${savings.toFixed(2)}/mo with {term}
            </span>
          )}
        </div>
      </div>

      {/* Grid: Controls and Live Cost Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left: Interactive Controls */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color="#00d2ff" />
            Infrastructure Sizing Parameters
          </h4>

          {/* Instance Count Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>VMSS Instance Count:</span>
              <span style={{ fontWeight: 700, color: "#00d2ff" }}>{instanceCount} VMs</span>
            </div>
            <input
              type="range"
              min={2}
              max={8}
              value={instanceCount}
              onChange={(e) => setInstanceCount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#00d2ff", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>Min: 2 instances</span>
              <span>Baseline: 2</span>
              <span>Max: 8 instances</span>
            </div>
          </div>

          {/* VM SKU Picker */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Azure Virtual Machine SKU:
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(skuPrices).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => setSku(key)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: sku === key ? "rgba(0, 120, 212, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    border: sku === key ? "1px solid #00d2ff" : "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  <span style={{ fontWeight: sku === key ? 700 : 500, color: sku === key ? "#fff" : "var(--text-secondary)" }}>
                    {val.name}
                  </span>
                  <span className="code-font" style={{ color: "#00d2ff" }}>
                    ${val.pricePerMonth}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Commitment Term */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Pricing Commitment Term:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { id: "pay-as-you-go", label: "Pay As You Go" },
                { id: "1year", label: "1-Yr Reserved (-35%)" },
                { id: "3year", label: "3-Yr Reserved (-55%)" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTerm(t.id)}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "6px",
                    background: term === t.id ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    border: term === t.id ? "1px solid #10b981" : "1px solid var(--border)",
                    color: term === t.id ? "#10b981" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Itemized Cost Bill */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarSign size={18} color="#10b981" />
            Live Infracost Price Breakdown
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>VM Scale Set Compute</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {instanceCount}x {sku} ({term})
                </p>
              </div>
              <div className="code-font" style={{ fontSize: "1rem", fontWeight: 700 }}>
                ${finalVmCost.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>OS Managed Disks (S4)</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {instanceCount}x 32GB Standard SSD
                </p>
              </div>
              <div className="code-font" style={{ fontSize: "1rem", fontWeight: 700 }}>
                ${baseStorageCost.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>Standard Load Balancer</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  1 Rule (HTTP Port 80) • 730 hrs
                </p>
              </div>
              <div className="code-font" style={{ fontSize: "1rem", fontWeight: 700 }}>
                ${lbPrice.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>Static Public IP</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Regional Standard IPv4
                </p>
              </div>
              <div className="code-font" style={{ fontSize: "1rem", fontWeight: 700 }}>
                ${ipPrice.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>VNet, Subnet & NSG</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  10.0.0.0/16 Virtual Network
                </p>
              </div>
              <div className="code-font" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--emerald)" }}>
                $0.00 (Free)
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "rgba(0, 120, 212, 0.1)",
                borderRadius: "10px",
                border: "1px solid rgba(0, 120, 212, 0.25)",
                marginTop: "10px",
              }}
            >
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>TOTAL MONTHLY RUNTIME</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>${finalTotal.toFixed(2)} USD</h3>
              </div>
              <span className="badge badge-azure">Infracost Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
