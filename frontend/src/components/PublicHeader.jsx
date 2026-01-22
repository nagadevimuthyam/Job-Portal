import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BRANDING } from "../config/branding";

const navItems = [
  { label: "Jobs", to: "/" },
  { label: "Learn", to: "/" },
];

const actions = [
  {
    label: "Login",
    to: "/candidate/login",
    className: "text-sm font-medium text-slate-700 hover:text-slate-900",
  },
  {
    label: "Register",
    to: "/candidate/register",
    className:
      "inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition",
  },
  {
    label: "Employers Login",
    to: "/employer/login",
    className:
      "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition",
  },
];

function useEscapeKey(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
}

function useLockBodyScroll(open) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
}

function SiteHeader({ open, onOpen, triggerRef }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            <span className="text-sm font-semibold">R</span>
          </div>
          <div>
            <p className="text-[15px] font-semibold leading-tight text-slate-900">
              {BRANDING.product}
            </p>
            <p className="text-xs leading-tight text-slate-500">Candidate Portal</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `text-sm font-medium text-slate-600 hover:text-slate-900 ${
                  isActive ? "text-blue-600" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to={actions[0].to} className={actions[0].className}>
            {actions[0].label}
          </Link>
          <Link to={actions[1].to} className={actions[1].className}>
            {actions[1].label}
          </Link>
          <Link to={actions[2].to} className={actions[2].className}>
            {actions[2].label}
          </Link>
        </div>

        <button
          type="button"
          ref={triggerRef}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={onOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function MobileDrawer({ open, onClose, closeRef }) {
  return (
    <div className="md:hidden">
      <div
        className={`fixed inset-0 z-40 bg-slate-900/35 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        id="mobile-menu"
        className={`fixed right-0 top-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <p className="text-sm font-semibold text-slate-900">Menu</p>
          <button
            type="button"
            ref={closeRef}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-slate-200 px-4 py-4">
          <div className="flex flex-col gap-2">
            <Link
              to={actions[0].to}
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {actions[0].label}
            </Link>
            <Link
              to={actions[1].to}
              onClick={onClose}
              className={actions[1].className}
            >
              {actions[1].label}
            </Link>
            <Link
              to={actions[2].to}
              onClick={onClose}
              className={actions[2].className}
            >
              {actions[2].label}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const prevOpen = useRef(false);

  useEscapeKey(open, () => setOpen(false));
  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else if (prevOpen.current) {
      triggerRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <SiteHeader open={open} onOpen={() => setOpen(true)} triggerRef={triggerRef} />
      <MobileDrawer open={open} onClose={() => setOpen(false)} closeRef={closeRef} />
    </>
  );
}
