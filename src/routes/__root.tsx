import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Globe, Instagram, Linkedin } from "lucide-react";

import appCss from "../styles.css?url";
import heroBg from "../assets/hero-bowls.jpg";
import { reportLovableError } from "../lib/lovable-error-reporting";

import fyloLogo from "../assets/fylo-logo.png.asset.json";

function FyloLogo({ className = "" }: { className?: string }) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <Link
      to="/"
      onClick={handleClick}
      className={`flex items-center gap-2 py-1 transition-transform hover:scale-105 ${className}`}
      aria-label="Fylo — back to top"
    >
      <img
        src={fyloLogo.url}
        alt="Fylo"
        className="h-11 w-11 object-contain drop-shadow-[0_6px_20px_oklch(0.62_0.24_27/0.5)]"
      />
    </Link>
  );
}

function Nav() {
  const linkBase =
    "text-sm text-white/75 transition-colors hover:text-white";
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-6 pt-5">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between">
        <FyloLogo />
        <nav className="glass-pill hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={`${linkBase} rounded-full px-4 py-1.5`}
            activeProps={{ className: "bg-white/10 text-white" }}
          >
            Home
          </Link>
          <Link
            to="/our-story"
            className={`${linkBase} rounded-full px-4 py-1.5`}
            activeProps={{ className: "bg-white/10 text-white" }}
          >
            Our Story
          </Link>
          <Link
            to="/faq"
            className={`${linkBase} rounded-full px-4 py-1.5`}
            activeProps={{ className: "bg-white/10 text-white" }}
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Switch language"
            className="glass-pill flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
          >
            <Globe className="h-4 w-4" />
          </button>
          <a
            href="https://app.tryfylo.co"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill rounded-full px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            Open App
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 pb-8 pt-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row">
        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} Fylo</span>
          <a href="#" className="hover:text-white/90">Privacy Policy</a>
          <a href="#" className="hover:text-white/90">Terms</a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/tryfylo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="glass-pill flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:text-secondary"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/company/tryfylo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="glass-pill flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:text-secondary"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function BackgroundStage() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1280}
        className="h-full w-full scale-105 object-cover"
      />
      {/* Cinematic scrim — dark at edges, image visible in the middle */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/15 to-background/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,oklch(0.14_0.02_20/0.55)_80%)]" />
      {/* Subtle brand color accents */}
      <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-secondary/15 blur-[140px]" />
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-hero text-6xl text-white">404</h1>
        <p className="mt-3 text-sm text-white/70">This page wandered off the menu.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-hero text-3xl text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/70">Try refreshing the page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fylo — We take care of you, so you can take care of life." },
      {
        name: "description",
        content:
          "Fylo learns your habits to recommend and compare your perfect daily lunches from Jahez, HungerStation, and Keeta.",
      },
      { property: "og:title", content: "Fylo — We take care of you, so you can take care of life." },
      {
        property: "og:description",
        content:
          "Honest weighted-scoring filtration that matches your macros to the city's actual restaurant supply.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Fylo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Fylo — We take care of you, so you can take care of life." },
      { name: "description", content: "Fylo is a culinary concierge that recommends and compares daily lunches from local apps based on your habits and health goals." },
      { property: "og:description", content: "Fylo is a culinary concierge that recommends and compares daily lunches from local apps based on your habits and health goals." },
      { name: "twitter:description", content: "Fylo is a culinary concierge that recommends and compares daily lunches from local apps based on your habits and health goals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c21d1d45-5296-4730-b250-3300d2f13d54/id-preview-71054c95--def5a45f-2401-4bed-8ead-9fec928ac8af.lovable.app-1782907335530.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c21d1d45-5296-4730-b250-3300d2f13d54/id-preview-71054c95--def5a45f-2401-4bed-8ead-9fec928ac8af.lovable.app-1782907335530.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundStage />
      <Nav />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
