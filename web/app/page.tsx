import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const FocusHeatmap = dynamic(() => import("@/components/insights/FocusHeatmap"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "220px",
      borderRadius: "var(--radius-lg)",
      background: "rgba(37, 99, 235, 0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-muted)"
    }}>
      Loading study trends…
    </div>
  )
});

export default function HomePage() {
  return (
    <section style={{ padding: "0 2rem 4rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
          alignItems: "center",
          marginTop: "4rem",
          marginBottom: "3rem"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.65rem",
            fontWeight: 600,
            color: "rgba(29, 78, 216, 1)"
          }}>
            <span style={{ width: "0.65rem", height: "0.65rem", borderRadius: "999px", background: "currentColor" }} />
            Real-time exam oversight
          </span>
          <h1 style={{ fontSize: "2.65rem", margin: 0, lineHeight: 1.1 }}>
            Stay checklist confident in every simulation lab.
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--color-muted)", margin: 0 }}>
            Surface the exact tasks to complete, track your progress across every encounter, and optionally pull on
            AI-powered suggestions without leaving the case flow.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              prefetch
              style={{
                padding: "0.85rem 1.35rem",
                borderRadius: "var(--radius-md)",
                background: "var(--color-accent)",
                color: "#ffffff",
                fontWeight: 600,
                boxShadow: "var(--shadow-floating)"
              }}
            >
              View prep resources
            </Link>
            <Link
              href="/schedule"
              prefetch
              style={{
                padding: "0.85rem 1.35rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(15, 23, 42, 0.12)",
                fontWeight: 600
              }}
            >
              Build a practice schedule
            </Link>
          </div>
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem" }}>
            <div>
              <dt style={{ fontSize: "2.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>92%</dt>
              <dd style={{ margin: 0, color: "var(--color-muted)" }}>of learners feel calmer before exams.</dd>
            </div>
            <div>
              <dt style={{ fontSize: "2.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>12 mins</dt>
              <dd style={{ margin: 0, color: "var(--color-muted)" }}>average time saved per simulation.</dd>
            </div>
          </dl>
        </div>
        <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-elevated)" }}>
          <Image
            src="/images/hero-illustration.svg"
            alt="Learner reviewing a checklist on a tablet"
            width={540}
            height={420}
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem"
        }}
      >
        <article style={{
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          background: "#ffffff",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}>
          <header>
            <h2 style={{ margin: 0 }}>Checklist that follows you</h2>
            <p style={{ margin: "0.5rem 0 0", color: "var(--color-muted)" }}>
              Open the floating toggle from any page to update your tasks instantly. We persist progress privately in
              local storage so you can close the panel without losing your place.
            </p>
          </header>
          <Image
            src="/images/checklist-panel.svg"
            alt="Checklist panel preview"
            width={480}
            height={320}
            style={{ width: "100%", height: "auto", borderRadius: "var(--radius-md)" }}
          />
        </article>
        <article style={{
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          background: "#ffffff",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}>
          <header>
            <h2 style={{ margin: 0 }}>Optional AI suggestions</h2>
            <p style={{ margin: "0.5rem 0 0", color: "var(--color-muted)" }}>
              With an OpenAI key configured, the `/api/ai-suggest` edge route drafts differential support and teaching
              pearls keyed to your current stage.
            </p>
          </header>
          <Image
            src="/images/ai-companion.svg"
            alt="AI assistant illustration"
            width={480}
            height={320}
            style={{ width: "100%", height: "auto" }}
          />
        </article>
        <article style={{
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          background: "#ffffff",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}>
          <header>
            <h2 style={{ margin: 0 }}>Smart focus insights</h2>
            <p style={{ margin: "0.5rem 0 0", color: "var(--color-muted)" }}>
              We highlight under-practiced competencies based on your completions. Get quick cues on where to focus next.
            </p>
          </header>
          <FocusHeatmap />
        </article>
      </div>

      <aside
        aria-label="Accessibility and performance callouts"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(37, 99, 235, 0.04))",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem"
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>Fast everywhere</h3>
          <p style={{ marginBottom: 0, color: "var(--color-muted)" }}>
            Route-based code splitting keeps the dashboard lean, with additional panels lazily loaded only when opened.
          </p>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Keyboard first</h3>
          <p style={{ marginBottom: 0, color: "var(--color-muted)" }}>
            The floating toggle has full keyboard support, focus states, and ARIA labeling for screen-reader clarity.
          </p>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Lighthouse ready</h3>
          <p style={{ marginBottom: 0, color: "var(--color-muted)" }}>
            We optimize images through Next/Image and serve SVG illustrations to keep the page under 90KB transfer.
          </p>
        </div>
      </aside>
    </section>
  );
}
