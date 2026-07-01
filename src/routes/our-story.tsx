import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/our-story")({
  component: OurStory,
  head: () => ({
    meta: [
      { title: "Our Story — Fylo" },
      {
        name: "description",
        content:
          "Fylo was born out of a simple frustration: food decisions take too much mental energy. Meet the honest weighted-scoring filtration engine.",
      },
      { property: "og:title", content: "Our Story — Fylo" },
      {
        property: "og:description",
        content:
          "Bridging the gap between your health goals and the city's actual restaurant supply.",
      },
      { property: "og:url", content: "/our-story" },
    ],
    links: [{ rel: "canonical", href: "/our-story" }],
  }),
});

function OurStory() {
  return (
    <section className="relative min-h-screen px-6 pt-40 pb-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-[0.24em] text-secondary/90">
          Our Story
        </span>
        <h1 className="text-hero mt-4 text-white text-5xl md:text-6xl">
          Food decisions were taking too much mental energy.
        </h1>

        <div className="glass-panel mt-12 space-y-6 rounded-3xl p-8 text-[17px] leading-relaxed text-white/80 md:p-12">
          <p>
            Fylo was born out of a simple frustration: food decisions take too
            much mental energy. Between conflicting health goals, an endless
            scroll of menus, and three delivery apps open at once, the moment
            you should feel taken care of becomes another chore on the list.
          </p>
          <p>
            So we built the world's first{" "}
            <span className="text-white">honest weighted-scoring filtration engine</span>
            —a system that reads your body, your budget, and your day, then
            quietly does the comparing for you.
          </p>
          <p>
            We bridge the gap between your health goals and the city's actual
            restaurant supply—calculating exact macros and comparing prices
            across{" "}
            <span className="text-secondary">Jahez</span>,{" "}
            <span className="text-secondary">HungerStation</span>, and{" "}
            <span className="text-secondary">Keeta</span> seamlessly.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { k: "Honest", v: "No paid placements. Ever." },
            { k: "Weighted", v: "Your goals, weighed against reality." },
            { k: "Seamless", v: "One tap to your favorite app." },
          ].map((item) => (
            <div
              key={item.k}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="text-xs uppercase tracking-widest text-secondary/90">
                {item.k}
              </div>
              <div className="mt-2 text-white">{item.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
