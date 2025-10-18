export const siteConfig = {
  name: "Context0",
  description:
    "A responsive knowledge and task orchestration shell crafted for multilingual collaboration.",
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Features", href: "/#features" },
    { title: "Solutions", href: "/#solutions" },
    { title: "Pricing", href: "/#pricing" },
    { title: "Docs", href: "/#docs" }
  ],
  footerNav: [
    { title: "Privacy", href: "#" },
    { title: "Terms", href: "#" },
    { title: "Support", href: "#" }
  ],
  social: [
    { title: "GitHub", href: "https://github.com" },
    { title: "LinkedIn", href: "https://linkedin.com" }
  ]
};

export type SiteConfig = typeof siteConfig;
