import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import "./globals.css";
import { ProgressProvider } from "@/components/providers/ProgressProvider";

const ChecklistToggle = dynamic(() => import("@/components/checklist/ChecklistToggle"), { ssr: false });

export const metadata: Metadata = {
  title: "Exam Navigator",
  description: "A persistent checklist and AI assistant to feel confident on exam day.",
  openGraph: {
    title: "Exam Navigator",
    description: "Track progress across clinical exam milestones with a floating checklist and optional AI assist.",
    url: "https://exam-navigator.app",
    siteName: "Exam Navigator",
    images: [
      {
        url: "/images/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Exam Navigator preview"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="visually-hidden" href="#main">
          Skip to content
        </a>
        <ProgressProvider>
          <header style={{
            width: "100%",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Link href="/">
              <span style={{ fontWeight: 700, fontSize: "1.15rem" }}>Exam Navigator</span>
            </Link>
            <nav aria-label="Primary">
              <ul style={{
                listStyle: "none",
                display: "flex",
                gap: "1.25rem",
                margin: 0,
                padding: 0,
                fontWeight: 500
              }}>
                <li>
                  <Link prefetch href="/resources">Resources</Link>
                </li>
                <li>
                  <Link prefetch href="/schedule">Schedule</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main id="main">{children}</main>
          <ChecklistToggle />
        </ProgressProvider>
      </body>
    </html>
  );
}
