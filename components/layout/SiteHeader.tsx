"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Download, Menu, X } from "@/components/ui/icons";
import { navLinks, profile } from "@/lib/content/site";

type BodyLock = {
  scrollY: number;
  position: string;
  top: string;
  width: string;
  overflow: string;
};

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const bodyLockRef = useRef<BodyLock | null>(null);

  const restoreBodyScroll = useCallback(() => {
    const lock = bodyLockRef.current;
    if (!lock) return;

    bodyLockRef.current = null;
    document.body.style.position = lock.position;
    document.body.style.top = lock.top;
    document.body.style.width = lock.width;
    document.body.style.overflow = lock.overflow;
    window.scrollTo(0, lock.scrollY);
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    restoreBodyScroll();
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, [restoreBodyScroll]);

  useLayoutEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    bodyLockRef.current = {
      scrollY: window.scrollY,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${window.scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    // The panel is still `visibility: hidden` during the frame that opens it,
    // and a hidden element cannot take focus, so wait for the frame after it is
    // painted. Without this the menu opened with focus left on the document.
    let focusFrameInner = 0;
    const focusFrame = window.requestAnimationFrame(() => {
      focusFrameInner = window.requestAnimationFrame(() => {
        document
          .getElementById("mobile-primary-navigation")
          ?.querySelector<HTMLElement>("a[href]")
          ?.focus();
      });
    });

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    window.addEventListener("keydown", onKeyDown);
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };
    desktopQuery.addEventListener("change", onDesktop);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.cancelAnimationFrame(focusFrameInner);
      window.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onDesktop);
      restoreBodyScroll();
    };
  }, [closeMenu, menuOpen, restoreBodyScroll]);

  function trapMenuFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const desktopLinks = (
    <>
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="nav-link font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper focus-visible:text-paper">
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <a href={profile.resume.publicPath} download={profile.resume.downloadName} className="nav-link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper focus-visible:text-paper">
          <Download aria-hidden="true" className="size-3.5" />
          Resume
        </a>
      </li>
    </>
  );

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={`${profile.name} — home`}>
          <Image src="/icons/icon-192.png" alt="" aria-hidden="true" width={36} height={36} className="size-8 shrink-0 object-contain sm:size-9" />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-paper sm:text-xs sm:tracking-[0.15em]">
              {profile.name}
            </span>
            <span className="font-mono text-[8px] uppercase leading-none tracking-[0.12em] text-dim sm:text-[9px]">
              Software developer
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-4 lg:gap-7">{desktopLinks}</ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center border border-line text-paper transition-colors hover:border-paper/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper xl:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => menuOpen ? closeMenu(true) : setMenuOpen(true)}
        >
          {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-primary-navigation"
        className="mobile-nav-panel xl:hidden"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        onKeyDown={trapMenuFocus}
      >
        <nav aria-label="Mobile primary" className="shell flex h-full flex-col justify-between py-8">
          <ul className="flex flex-col">
            {navLinks.map((link, index) => (
              <li key={link.href} className="border-b border-line/70">
                <Link
                  href={link.href}
                  onClick={() => closeMenu()}
                  className="flex min-h-16 items-center justify-between gap-4 font-display text-3xl font-medium uppercase tracking-[-0.04em] text-paper focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-paper"
                >
                  {link.label}
                  <span aria-hidden="true" className="font-mono text-xs tracking-normal text-muted">{String(index + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-4 border-t border-line/70 pt-6">
            <a href={profile.resume.publicPath} download={profile.resume.downloadName} onClick={() => closeMenu()} className="inline-flex min-h-11 items-center gap-3 border border-line px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
              <Download aria-hidden="true" className="size-4" />
              Download resume
            </a>
            <p className="meta">{profile.name} / Independent developer</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
