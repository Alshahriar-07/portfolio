"use client";

import { useEffect } from "react";
import { profile } from "@/lib/content/site";

/**
 * Cinematic first-visit intro.
 *
 * Server-renders as a fully hidden overlay. The small boot script in the root
 * layout records `intro-active` on `#boot-state` in <head> before the first
 * paint, so the intro starts without a flash while React's hydrated markup
 * (including the font classes on <html>) is never mutated. This component then:
 *   1. marks the session as intro-seen as the overlay starts to exit,
 *   2. removes `intro-active` after the wipe and the held hero entrance have
 *      both finished, so the entrance delay is never rewritten mid-flight.
 *
 * Without `intro-active` the overlay stays invisible from its base CSS
 * (opacity 0, visibility hidden, pointer-events none), so the component can
 * stay mounted harmlessly. If JavaScript never runs, no state element is
 * created and the site remains fully usable.
 */
export function IntroOverlay() {
  useEffect(() => {
    const state = document.getElementById("boot-state");
    if (!state?.classList.contains("intro-active")) return;

    // The overlay's exit starts at 1.2s; mark the session seen as it begins.
    const seenTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("intro-seen", "1");
      } catch {
        // Storage can be blocked (private mode); the intro just replays next session.
      }
    }, 1250);

    // The longest held entrance is the sculpture: 1250ms hold + 1400ms fade.
    // Releasing after that keeps every entrance's animation-delay stable for
    // its whole run (changing a delay mid-animation would jump the element).
    const releaseTimer = window.setTimeout(() => {
      state.classList.remove("intro-active");
    }, 2800);

    return () => {
      window.clearTimeout(seenTimer);
      window.clearTimeout(releaseTimer);
    };
  }, []);

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div className="intro-stage">
        <p className="intro-meta">
          <span>{profile.role} — Portfolio</span>
        </p>
        <p className="intro-name">
          <span>{profile.name}</span>
        </p>
        <span className="intro-rule" aria-hidden="true" />
      </div>
    </div>
  );
}
