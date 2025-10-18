import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Context0 · Orchestrate resilient agents',
  description:
    'Context0 helps agents manage, offload, and retrieve knowledge with confidence. Explore the tool playbook to build production-ready flows.',
};

export default function HomePage() {
  return (
    <main
      style={{
        width: 'min(960px, 100%)',
        margin: '0 auto',
        padding: '6rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(148,163,184,0.75)',
          }}
        >
          Context0 platform
        </span>
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 5vw, 3.4rem)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Your command center for memory-safe agent workflows
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'rgba(203,213,225,0.85)',
            maxWidth: '60ch',
          }}
        >
          Context0 blends contextual retrieval, summarisation, and managed offloading into a single
          playbook. Dive into the Tool module to see exactly how the pieces fit together.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/tools" className="btn btn--primary">
          Explore the tools
        </Link>
        <Link href="/tools" className="btn btn--ghost">
          Quick overview
        </Link>
      </div>
    </main>
  );
}
