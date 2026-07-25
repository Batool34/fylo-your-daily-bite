import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2 } from "lucide-react";
import { getVisitorId, trackEvent } from "@/lib/analytics";
import { joinWaitlist } from "@/lib/waitlist.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Picky — We take care of you, so you can take care of life." },
      {
        name: "description",
        content:
          "Picky learns your habits to recommend and compare your perfect daily lunches from your favorite local delivery apps.",
      },
      { property: "og:title", content: "Picky — Your daily lunch, curated" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const submit = useServerFn(joinWaitlist);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [alreadyOnList, setAlreadyOnList] = useState(false);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.trim().length <= 320;

  const isValidPhone = (v: string) => {
    const digits = v.replace(/[^\d]/g, "");
    return (
      /^\+?[\d\s\-()]{8,20}$/.test(v.trim()) &&
      digits.length >= 8 &&
      digits.length <= 15
    );
  };

  const canSubmit =
    !submitting && isValidEmail(email) && isValidPhone(phone);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await submit({
        data: { email: email.trim().toLowerCase(), phone: phone.trim() },
      });
      trackEvent("waitlist_submit", {
        email_domain: email.split("@")[1] ?? "",
        phone: phone.replace(/\D/g, ""),
        duplicate: result.duplicate,
      });
      setAlreadyOnList(Boolean(result.duplicate));
      setJoined(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onFastTrack = () => {
    const digits = phone.replace(/\D/g, "");
    const visitor_id = getVisitorId();
    const params = new URLSearchParams({
      phone: digits,
      email: email.trim().toLowerCase(),
      visitor_id,
      utm_source: "landing",
      utm_campaign: "waitlist",
    });
    trackEvent("fast_track_click", { phone: digits });
    window.location.href = `https://app.tryfylo.co/onboarding?${params.toString()}`;
  };

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
          between. Picky learns your habits to recommend and compare your
          perfect daily lunches from your favorite local apps.
        </p>

        {joined ? (
          <div
            className="glass-panel mt-10 w-full max-w-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 rounded-3xl border border-secondary/40 bg-secondary/10 px-8 py-8 text-center duration-700"
            role="status"
            aria-live="polite"
          >
            <p className="text-hero text-4xl text-white md:text-5xl">
              {alreadyOnList ? (
                <>You're already on the list 👀</>
              ) : (
                <>You're on the list! <span aria-hidden>👀</span></>
              )}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              {alreadyOnList
                ? "We've got you saved. Check your inbox for your welcome note."
                : "Welcome to Picky. Check your inbox — your welcome email is on its way."}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/85 md:text-base">
              Want priority access? Calibrate your personal AI meal filter right now to secure your lunch recommendations on day one.
            </p>
            <button
              type="button"
              onClick={onFastTrack}
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.6_0.22_25/0.7)] transition-all hover:bg-primary/90"
            >
              Fast-Track My Access
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-10 flex w-full max-w-xl flex-col gap-3"
          >
            <div className="flex flex-col gap-2 rounded-3xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_-15px_oklch(0_0_0/0.5)] sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 sm:pl-5">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-2xl bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none sm:rounded-none sm:px-0"
                aria-label="Email address"
              />
              <span className="hidden h-5 w-px bg-white/15 sm:block" />
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
                className="flex-1 rounded-2xl bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none sm:rounded-none sm:px-0"
                aria-label="Mobile phone number"
              />
              <button
                type="submit"
                disabled={!canSubmit}
                className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.6_0.22_25/0.7)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Joining…
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-300" role="alert">
                {errorMsg}
              </p>
            )}
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
