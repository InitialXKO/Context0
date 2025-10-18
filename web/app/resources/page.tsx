import Image from "next/image";

const resources = [
  {
    title: "Rapid differential drills",
    description: "Timed cases grouped by acuity. Toggle the checklist mid-run without losing context.",
    href: "https://example.com/differential",
    image: "/images/resource-differential.svg"
  },
  {
    title: "Communication micro-sims",
    description: "Practice SBAR handoffs and patient education scripts with auto insights.",
    href: "https://example.com/communication",
    image: "/images/resource-communication.svg"
  },
  {
    title: "Evidence cheat-sheets",
    description: "Download quick references for labs, imaging, and red flag thresholds.",
    href: "https://example.com/evidence",
    image: "/images/resource-evidence.svg"
  }
];

export default function ResourcesPage() {
  return (
    <section style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <header style={{ maxWidth: "720px" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>Resources to stay ready</h1>
        <p style={{ fontSize: "1rem", color: "var(--color-muted)", margin: 0 }}>
          Deepen your preparation with curated drills and quick references. Everything works seamlessly with the floating
          checklist.
        </p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.75rem"
        }}
      >
        {resources.map((resource) => (
          <article
            key={resource.title}
            style={{
              borderRadius: "var(--radius-lg)",
              background: "#ffffff",
              boxShadow: "var(--shadow-elevated)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Image src={resource.image} alt="" width={480} height={260} style={{ width: "100%", height: "auto" }} />
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ margin: 0 }}>{resource.title}</h2>
              <p style={{ margin: 0, color: "var(--color-muted)" }}>{resource.description}</p>
              <a
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 600, color: "var(--color-accent)" }}
              >
                Open guide ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
