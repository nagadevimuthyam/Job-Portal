import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useMeQuery } from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";

const tabs = [
  { label: "Search", to: "/employer/search" },
  { label: "Jobs", to: "/employer/jobs" },
  { label: "Campaign", to: "/employer/campaign" },
  { label: "Folders", to: "/employer/folders" },
  { label: "Reports", to: "/employer/reports" },
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

export default function EmployerHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const prevOpen = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: me } = useMeQuery();

  const initials = (me?.full_name || "E")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/employer/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-surface-3 bg-surface-inverse/90 backdrop-blur">
        <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between px-6">
          <div>
            <p className="text-sm font-semibold text-ink">Employer Console</p>
            <p className="text-xs text-ink-faint">{me?.organization?.name || "Recruitment SaaS"}</p>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-brand-600 text-surface-inverse" : "text-ink hover:bg-surface-2"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            ref={triggerRef}
            className="flex items-center gap-2 rounded-full border border-surface-3 bg-surface-inverse px-2 pr-3 text-sm font-semibold text-ink shadow-sm"
            onClick={() => setOpen(true)}
            aria-label="Open profile"
            aria-expanded={open}
            aria-controls="employer-profile"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {initials}
            </span>
            <span className="hidden lg:inline">Hello, {me?.full_name || "Employer"}</span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-900/35 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        id="employer-profile"
        className={`fixed right-0 top-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <p className="text-sm font-semibold text-slate-900">Profile</p>
          <button
            type="button"
            ref={closeRef}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close profile"
            onClick={() => setOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{me?.full_name || "Employer"}</p>
                <p className="text-xs text-slate-500">{me?.organization?.name || ""}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {me?.phone && (
                <p className="flex items-center gap-2">
                  <span className="text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.81 19.86 19.86 0 0 1 0 0.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.12.81.32 1.6.59 2.36a2 2 0 0 1-.45 2.11L6 7a16 16 0 0 0 11 11l.81-1.14a2 2 0 0 1 2.11-.45c.76.27 1.55.47 2.36.59A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  {me.phone}
                </p>
              )}
              {me?.email && (
                <p className="flex items-center gap-2">
                  <span className="text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16v16H4z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </span>
                  {me.email}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/employer/profile");
              }}
              className="flex h-11 w-full items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              View & Update Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-full items-center rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
