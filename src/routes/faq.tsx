import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    meta: [
      { title: "FAQ — Fylo" },
      {
        name: "description",
        content:
          "Answers about how Fylo scores meals, deep-links to Jahez, HungerStation, and Keeta, and respects your macros.",
      },
      { property: "og:title", content: "FAQ — Fylo" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
});

const items = [
  {
    q: "How does Fylo know my macro needs?",
    a: "It processes your health goals and dietary preferences directly from our onboarding engine—age, activity, targets, allergies—and continuously refines as you rate meals.",
  },
  {
    q: "Does Fylo deliver the food?",
    a: "No, Fylo is an intelligent curator. We find your perfect matches and deep-link you directly to Keeta, Jahez, or HungerStation to complete the order instantly in SAR.",
  },
  {
    q: "Which cities does Fylo cover?",
    a: "We're launching in Riyadh first, with Jeddah and the Eastern Province rolling out shortly after based on waitlist demand.",
  },
  {
    q: "Is my health data private?",
    a: "Yes. Your profile is encrypted, never sold, and only used to power your recommendations inside the app.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative min-h-screen px-6 pt-40 pb-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.24em] text-secondary/90">
          FAQ
        </span>
        <h1 className="text-hero mt-4 text-white text-5xl md:text-6xl">
          Everything, calmly answered.
        </h1>
        <p className="mt-5 max-w-xl text-white/70">
          Still curious? Reach out anytime at{" "}
          <a className="text-secondary hover:underline" href="mailto:hi@tryfylo.co">
            hi@tryfylo.co
          </a>
          .
        </p>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="glass-panel rounded-2xl transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-white md:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden px-6 transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 text-[15px] leading-relaxed text-white/75">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
