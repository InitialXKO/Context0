"use client";

import React from "react";

const timeBlocks = [
  { label: "Warm-up", duration: 15, focus: "Vitals + orientation" },
  { label: "Simulation", duration: 30, focus: "Full encounter" },
  { label: "Debrief", duration: 10, focus: "Reflect + AI suggestions" },
  { label: "Checklist review", duration: 8, focus: "Log insights" }
];

export default function SchedulePage() {
  const [blocks, setBlocks] = React.useState(timeBlocks);

  const totalMinutes = blocks.reduce((total, block) => total + block.duration, 0);

  function updateDuration(index: number, value: number) {
    setBlocks((current) =>
      current.map((block, i) => (i === index ? { ...block, duration: Math.max(5, Math.min(90, value)) } : block))
    );
  }

  return (
    <section style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "720px" }}>
      <header>
        <h1 style={{ marginBottom: "0.5rem" }}>Shape your practice schedule</h1>
        <p style={{ margin: 0, color: "var(--color-muted)" }}>
          Adjust durations to match the intensity of your upcoming lab. Progress context stays active as you iterate.
        </p>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {blocks.map((block, index) => (
          <div
            key={block.label}
            style={{
              background: "#ffffff",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              boxShadow: "var(--shadow-elevated)",
              display: "grid",
              gap: "0.75rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{block.label}</strong>
              <span style={{ color: "var(--color-muted)" }}>{block.focus}</span>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span className="visually-hidden">Duration for {block.label}</span>
              <input
                type="range"
                min={5}
                max={90}
                value={block.duration}
                onChange={(event) => updateDuration(index, Number(event.target.value))}
                aria-valuenow={block.duration}
                aria-label={`Minutes allocated to ${block.label}`}
              />
            </label>
            <span style={{ fontWeight: 600 }}>{block.duration} minutes</span>
          </div>
        ))}
      </div>
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Total practice time</span>
        <strong>{totalMinutes} minutes</strong>
      </footer>
    </section>
  );
}
