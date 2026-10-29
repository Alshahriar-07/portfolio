"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "@/components/ui/icons";

/**
 * Download confirmation toast.
 *
 * Every resume link in the site is a plain `<a download>` pointing at the PDF
 * served from public/, so one document-level listener can cover all of them
 * without turning each link into a client component. A single toast instance
 * with a restarted timer means rapid repeat clicks can never stack
 * notifications. Hidden markup stays in the DOM but is `aria-hidden`, so screen
 * readers only hear it when it actually appears.
 */
export function ResumeToast() {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("a[download]")) return;

      setVisible(true);
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        hideTimer.current = null;
        setVisible(false);
      }, 3200);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <div className="toast" data-visible={visible} role="status" aria-hidden={!visible}>
        <span className="toast-mark" aria-hidden="true">
          <Check />
        </span>
        <span className="toast-copy">
          <strong>Resume downloaded</strong>
          <span>Your download has started successfully.</span>
        </span>
      </div>
    </div>
  );
}
