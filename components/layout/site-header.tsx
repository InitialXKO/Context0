"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
};

type SiteHeaderProps = {
  siteName: string;
  navItems: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
};

export function SiteHeader({ siteName, navItems, cta }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const renderLinks = (orientation: "horizontal" | "vertical" = "horizontal") => (
    <nav
      className={cn(
        "flex",
        orientation === "horizontal" ? "items-center gap-6" : "flex-col gap-4"
      )}
    >
      {navItems.map((item) => {
        const basePath = item.href.split("#")[0] || "/";
        const isActive = pathname === basePath;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setOpen(false)}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-lg font-heading font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            C0
          </span>
          <span>{siteName}</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {renderLinks()}
          {cta ? (
            <Button asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-card">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-heading">{siteName}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {renderLinks("vertical")}
              {cta ? (
                <Button asChild className="w-full">
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
