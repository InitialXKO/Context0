"use client";

import React from "react";

const sampleData = [
  { label: "Airway", value: 92 },
  { label: "Cardio", value: 68 },
  { label: "Pediatrics", value: 54 },
  { label: "Neurology", value: 77 },
  { label: "Pharm", value: 41 }
];

export default function FocusHeatmap() {
  const [data, setData] = React.useState(sampleData);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setData((current) =>
        current.map((item) => ({
          ...item,
          value: Math.max(20, Math.min(100, Math.round(item.value + (Math.random() - 0.5) * 10)))
        }))
      );
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="img"
      aria-label="Heatmap of focus areas"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.5rem",
        borderRadius: "var(--radius-md)",
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05))"
      }}
    >
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div
            aria-hidden
            style={{
              width: "100%",
              height: "0.75rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.4)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${item.value}%`,
                height: "100%",
                borderRadius: "999px",
                background: "rgba(37, 99, 235, 0.95)",
                transition: "width 600ms ease"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
