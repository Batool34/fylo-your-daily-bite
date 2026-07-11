// Lightweight visitor tracking. Generates a stable visitor_id on first load,
// persists it to localStorage, and forwards pageviews/events to any analytics
// sink present on window (dataLayer / gtag / posthog). Safe on SSR.

const STORAGE_KEY = "fylo-visitor-id";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122 v4 fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

type AnalyticsPayload = Record<string, unknown>;

export function trackEvent(event: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;
  const visitor_id = getVisitorId();
  const data = { event, visitor_id, ...payload };

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture: (e: string, p: AnalyticsPayload) => void };
  };

  try {
    (w.dataLayer ||= []).push(data);
  } catch {
    /* no-op */
  }
  try {
    w.gtag?.("event", event, { ...payload, visitor_id });
  } catch {
    /* no-op */
  }
  try {
    w.posthog?.capture(event, { ...payload, visitor_id });
  } catch {
    /* no-op */
  }
}

export function trackPageview(path?: string): void {
  if (typeof window === "undefined") return;
  trackEvent("pageview", {
    path: path ?? window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
  });
}
