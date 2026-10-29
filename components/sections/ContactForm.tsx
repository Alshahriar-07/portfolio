"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Send } from "@/components/ui/icons";

type SubmissionState = "idle" | "sending" | "success" | "error";

const inputClass =
  "mt-2 min-h-12 w-full border border-line bg-ink px-4 py-3 text-sm text-paper placeholder:text-dim focus:border-paper/70 focus:outline-none focus:ring-1 focus:ring-paper/30";

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();

  // Move focus to the confirmation without scrolling the page under the reader.
  useEffect(() => {
    if (state === "success") successHeadingRef.current?.focus({ preventScroll: true });
  }, [state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    if (!accessKey) {
      setState("error");
      setMessage("The contact form is not configured yet. Please email me directly instead.");
      return;
    }

    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("access_key", accessKey);
    formData.set("subject", `Portfolio contact: ${String(formData.get("subject") ?? "")}`);
    formData.set("from_name", "Portfolio contact form");
    formData.set("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = (await response.json()) as { success?: boolean };

      if (!response.ok || result.success !== true) {
        throw new Error("The message could not be sent. Please try again, or email me directly.");
      }

      form.reset();
      setState("success");
      setMessage("");
    } catch (error) {
      setState("error");
      const isNetworkError = error instanceof Error && error.message.toLowerCase().includes("failed to fetch");
      setMessage(
        isNetworkError
          ? "The message could not reach the form service. Check your connection and try again, or email me directly."
          : "The message could not be sent. Please try again, or email me directly.",
      );
    }
  }

  if (state === "success") {
    return (
      <div className="contact-success" role="status" aria-live="polite">
        <span className="contact-success-mark" aria-hidden="true">
          <Check />
        </span>
        <h3 ref={successHeadingRef} tabIndex={-1} className="contact-success-title">
          Thanks for contacting me
        </h3>
        <p className="contact-success-copy">
          Your message has been sent successfully. I appreciate you reaching out and will get
          back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={state === "sending"}>
      {!accessKey ? (
        <p className="border border-line bg-ink-raised px-4 py-3 text-sm leading-relaxed text-muted" role="status">
          This form needs a Web3Forms access key before live submissions are available. You can email me directly instead.
        </p>
      ) : null}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="meta text-paper">Name <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="meta text-paper">Email <span aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className={inputClass} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="meta text-paper">Subject <span aria-hidden="true">*</span></label>
        <input id="contact-subject" name="subject" type="text" required minLength={2} maxLength={150} className={inputClass} placeholder="What would you like to discuss?" />
      </div>
      <div>
        <label htmlFor="contact-message" className="meta text-paper">Message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} className={`${inputClass} min-h-40 resize-y`} placeholder="A little context helps me get back to you." />
      </div>

      <div className="flex flex-col gap-4 border-t border-line/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-paper bg-paper px-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-transparent hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper disabled:cursor-wait disabled:opacity-60"
        >
          {state === "sending" ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
          {state === "sending" ? "Sending message" : "Send message"}
        </button>
        <p className="text-xs leading-relaxed text-muted">Required fields are marked with *.</p>
      </div>

      {state === "error" && message ? (
        <div
          className="form-feedback flex min-h-12 items-start gap-3 border border-line px-4 py-3 text-sm leading-relaxed text-paper"
          data-state="error"
          role="alert"
          aria-live="assertive"
        >
          <span>{message}</span>
        </div>
      ) : null}
    </form>
  );
}
