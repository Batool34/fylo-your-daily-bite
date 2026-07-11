import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { getVisitorId, trackEvent } from "@/lib/analytics";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Fylo — We take care of you, so you can take care of life." },
      {
        name: "description",
        content:
          "Fylo learns your habits to recommend and compare your perfect daily lunches from Jahez, HungerStation, and Keeta.",
      },
      { property: "og:title", content: "Fylo — Your daily lunch, curated" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const [phone, setPhone] = useState("");
  const [joined, setJoined] = useState(false);

  // Accept international format: optional +, 8–15 digits total, spaces/dashes allowed
  const isValidPhone = (v: string) => {
    const digits = v.replace(/[^\d]/g, "");
    return /^\+?[\d\s\-()]{8,20}$/.test(v.trim()) && digits.length >= 8 && digits.length <= 15;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidPhone(phone)) return;
    const digits = phone.replace(/\D/g, "");
    const visitor_id = getVisitorId();
    const body = new URLSearchParams({ "form-name": "waitlist", phone }).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }).catch(() => {
      // Netlify only accepts submissions on the deployed site; ignore local errors.
    });
    trackEvent("waitlist_submit", { phone: digits });
    setJoined(true);
    const params = new URLSearchParams({
      phone: digits,
      visitor_id,
      utm_source: "landing",
      utm_campaign: "waitlist",
    });
    window.location.href = `https://app.tryfylo.co/onboarding?${params.toString()}`;
  };



  const canSubmit = isValidPhone(phone);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <span className="glass-pill mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Now taking waitlist
        </span>

        <h1 className="text-hero text-white text-5xl md:text-7xl">
          We take care of <em className="not-italic text-secondary">you</em>,
          <br />
          so you can take care of life.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
          Supporting every version of you—healthy, unhealthy, and everything in
          between. Fylo learns your habits to recommend and compare your perfect
          daily lunches from your favorite local apps.
        </p>

        {joined ? (
          <div
            className="glass-panel mt-10 w-full max-w-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 rounded-3xl border border-secondary/40 bg-secondary/10 px-8 py-8 text-center duration-700"
            role="status"
            aria-live="polite"
          >
            <p className="text-hero text-4xl text-white md:text-5xl">
              You're in! <span aria-hidden>🚀</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              Welcome to Fylo. We've saved your spot. Watch your inbox for early access.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/85 md:text-base">
              Want priority access? Calibrate your personal AI meal filter right now to secure your lunch recommendations on day one.
            </p>
            <a
              href={`https://app.tryfylo.co/?phone=${encodeURIComponent(phone)}`}
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.6_0.22_25/0.7)] transition-all hover:bg-primary/90"
            >
              Fast-Track My Access
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        ) : (
          <form
            name="waitlist"
            method="POST"
            data-netlify="true"
            onSubmit={onSubmit}
            className="mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 pl-5 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_-15px_oklch(0_0_0/0.5)]"
          >
            <input type="hidden" name="form-name" value="waitlist" />
            <input
              type="tel"
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
              pattern="^\+?[\d\s\-()]{8,20}$"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 5X XXX XXXX"
              className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
              aria-label="Mobile phone number"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.6_0.22_25/0.7)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
            >
              Join Waitlist
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center gap-6 text-xs text-white/55">
          <span>Compares across</span>
          <span className="text-white/85">Jahez</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-white/85">HungerStation</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-white/85">Keeta</span>
        </div>
      </div>
    </section>
  );
}
