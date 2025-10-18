import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { heading, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Context orchestration shell`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "https://example.com",
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website"
  },
  icons: {
    icon: "/favicon.ico"
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground", sans.variable, heading.variable)}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader
              siteName={siteConfig.name}
              navItems={siteConfig.mainNav}
              cta={{ label: "Get Started", href: "/#get-started" }}
            />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t bg-background/70">
              <div className="container py-12">
                <div className="grid gap-8 md:grid-cols-2 md:gap-16">
                  <div className="space-y-4">
                    <p className="text-2xl font-heading font-semibold text-primary">
                      {siteConfig.name}
                    </p>
                    <p className="max-w-md text-sm text-muted-foreground">
                      {siteConfig.description}
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
                        Explore
                      </h4>
                      <ul className="grid gap-2 text-sm text-muted-foreground">
                        {siteConfig.footerNav.map((item) => (
                          <li key={item.title}>
                            <Link href={item.href} className="transition-colors hover:text-primary">
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
                        Stay Connected
                      </h4>
                      <ul className="grid gap-2 text-sm text-muted-foreground">
                        {siteConfig.social.map((item) => (
                          <li key={item.title}>
                            <Link href={item.href} className="transition-colors hover:text-primary">
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
                  <p className="text-[11px]">
                    Crafted for seamless bilingual collaboration in the browser.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
