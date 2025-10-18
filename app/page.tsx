import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const featureHighlights = [
  {
    title: "Contextual Awareness",
    description: "Segment, summarize, and retrieve knowledge seamlessly across your teams.",
    accent: "即时洞察"
  },
  {
    title: "Task Orchestration",
    description: "Launch multi-step automations driven by natural language in seconds.",
    accent: "智能协同"
  },
  {
    title: "Global Readiness",
    description: "Optimized typography for Chinese and English readers with responsive layouts.",
    accent: "双语体验"
  }
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      <section id="hero" className="container grid gap-10 pt-16 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            新一代上下文控制台
          </span>
          <h1 className="text-4xl font-heading font-semibold leading-tight tracking-tight text-secondary md:text-5xl">
            Orchestrate knowledge flows with confidence and human warmth.
          </h1>
          <p className="max-w-lg text-base text-muted-foreground md:text-lg">
            Context0 brings together intelligent summarization, precise retrieval, and collaborative task execution into a single bilingual workspace.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/#get-started" className="inline-flex items-center gap-2">
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#docs">View Documentation</Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-muted/50 to-secondary/10 p-10 shadow-xl">
          <div className="grid gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Playbook</p>
              <h2 className="text-xl font-heading font-semibold text-secondary">Adaptive Knowledge Canvas</h2>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-background/60">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <p className="text-sm text-muted-foreground">
                  Monitor live context summaries, handoff tasks to AI agents, and anchor decision trails with a single click.
                </p>
              </TabsContent>
              <TabsContent value="insights">
                <p className="text-sm text-muted-foreground">
                  Smart highlights surface the most relevant updates from distributed sources and translate them instantly.
                </p>
              </TabsContent>
              <TabsContent value="actions">
                <p className="text-sm text-muted-foreground">
                  Launch powerful workflows, manage approvals, and sync results back to your favorite tools effortlessly.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          <div className="pointer-events-none absolute inset-x-6 bottom-6 h-32 rounded-full bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
        </div>
      </section>

      <section id="features" className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-heading font-semibold text-secondary md:text-4xl">Built for fast-moving teams</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Align human expertise and agent intelligence with a visual shell that speaks fluent Mandarin and English.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featureHighlights.map((feature) => (
            <Card key={feature.title} className="relative overflow-hidden border-primary/20">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {feature.accent}
                </p>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/#docs" className="inline-flex items-center gap-1">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10" />
            </Card>
          ))}
        </div>
      </section>

      <section id="solutions" className="container">
        <div className="rounded-3xl border border-secondary/30 bg-secondary/5 p-10 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-semibold text-secondary">Unified data, intuitive experience</h2>
              <p className="text-muted-foreground">
                Route contextual knowledge to the right teammate with responsive layouts that adapt from wide dashboards to handheld devices in a heartbeat.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Tailwind CSS
                </span>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  shadcn/ui
                </span>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Framer Motion
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {["Responsive Shell", "Workflow Library", "Live Translation", "Granular Permissions"].map((item) => (
                <Card key={item} className="border-muted/50 bg-background/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-secondary">{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Curated templates that keep complex operations approachable for global teams.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-heading font-semibold text-secondary">Pricing that scales with clarity</h2>
          <p className="mt-3 text-muted-foreground">
            Start with a guided sandbox and grow into enterprise orchestration without friction.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>
                Perfect for teams piloting bilingual knowledge workspaces and lightweight automations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-secondary">Free</p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <li>• 100 managed contexts</li>
                <li>• Unlimited agent playbooks</li>
                <li>• Community support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/#get-started">Choose Starter</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-secondary/40 bg-secondary/10">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>
                Deep integrations, compliance tooling, and proactive success support for global organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold text-secondary">Custom</p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <li>• Unlimited segmentation layers</li>
                <li>• Dedicated solution architect</li>
                <li>• 24/7 bilingual support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="mailto:team@example.com">Talk to us</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="docs" className="container">
        <div className="rounded-2xl border border-muted/60 bg-background/80 p-10 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-semibold text-secondary">Documentation</h2>
              <p className="text-muted-foreground">
                Explore component guides, workflow recipes, and localization tips in our curated knowledge base.
              </p>
              <Button variant="outline" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  Open Docs Portal
                </Link>
              </Button>
            </div>
            <Card className="border-muted/50 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg font-heading text-secondary">Quick links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="transition-colors hover:text-primary">
                      • Building responsive shells with Tailwind
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-primary">
                      • Designing bilingual typography systems
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-primary">
                      • Automating knowledge offloading
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="get-started" className="container">
        <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10 p-10 text-center shadow-xl">
          <h2 className="text-3xl font-heading font-semibold text-secondary md:text-4xl">
            Ready to orchestrate context like a pro?
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Join early adopters blending AI precision with human creativity across Greater China and beyond.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">Book an onboarding call</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:team@example.com">Email our team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
