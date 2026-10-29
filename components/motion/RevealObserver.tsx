"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal driver.
 *
 * Adds `reveal-ready` to <html> only when reduced motion is not requested —
 * so every `[data-reveal]` element is fully visible by default (no-JS,
 * unsupported browsers, reduced motion). When the class is present, elements
 * acquire their hidden-from state and get revealed once, the first time they
 * enter the viewport. `data-revealed` prevents any second run.
 *
 * Primary mechanism is IntersectionObserver. A passive scroll/resize fallback
 * (rAF-throttled, layout reads only inside the frame) reveals anything the
 * observer misses — some environments throttle observer callbacks on idle
 * pages — and self-retires once nothing is pending. Reveals are
 * transform/opacity only, so neither path can shift layout or scroll.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const pending = new Set<HTMLElement>();

    const reveal = (element: HTMLElement) => {
      element.setAttribute("data-revealed", "");
      pending.delete(element);
      io?.unobserve(element);
    };

    // Only hide reveal targets once there is a way to reveal them again;
    // otherwise a missing observer would leave the page permanently blank.
    if (typeof IntersectionObserver !== "function") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      {
        // Fire just before the element is comfortably inside the
        // viewport so the reveal is always seen.
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    // Idempotent: this effect re-runs on every route change, so new content
    // gets its own observer even though the class is already set.
    root.classList.add("reveal-ready");

    const collect = () => {
      for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
        if (!element.hasAttribute("data-revealed") && !pending.has(element)) {
          pending.add(element);
          io.observe(element);
        }
      }
    };

    let raf = 0;
    const boundsCheck = () => {
      raf = 0;
      if (pending.size === 0) return;
      const limit = window.innerHeight - Math.round(window.innerHeight * 0.1);
      for (const element of [...pending]) {
        if (element.getBoundingClientRect().top < limit) reveal(element);
      }
      if (pending.size === 0) detach();
    };
    const scheduleCheck = () => {
      if (raf === 0) raf = window.requestAnimationFrame(boundsCheck);
    };

    const detach = () => {
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (raf !== 0) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Fallback safety net: reveals pending items on scroll in case the
    // observer's scheduled callback is starved on an idle page.
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    // Re-observe after client-side route changes swap in new content.
    const mutations = new MutationObserver(() => collect());
    mutations.observe(document.body, { childList: true, subtree: true });

    collect();
    // The browser may already be scrolled (hash link, partial history restore)
    // by the time this runs — check present geometry once immediately.
    scheduleCheck();

    return () => {
      detach();
      io.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
