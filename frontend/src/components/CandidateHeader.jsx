import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BRANDING } from "../config/branding";
import { useMeQuery } from "../features/auth/authApi";
import { useGetProfileQuery } from "../features/candidate/candidateProfileApi";
import { logout } from "../features/auth/authSlice";

const navItems = [
  { label: "Jobs", to: "/" },
  { label: "Companies", to: "/" },
  { label: "Services", to: "/" },
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

export default function CandidateHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const prevOpen = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: me } = useMeQuery();
  const { data } = useGetProfileQuery();
  const profile = data?.profile;

  const initials = (me?.full_name || "C")
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
    navigate("/candidate/login");
  };

  return (
    <>
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
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <input
                className="h-10 w-64 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search jobs here"
                aria-label="Search jobs"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button
              type="button"
              ref={triggerRef}
              className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-2 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(true)}
              aria-label="Open profile menu"
              aria-expanded={open}
              aria-controls="candidate-profile"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden lg:inline">{me?.full_name || "Profile"}</span>
            </button>
          </div>

          <button
            type="button"
            ref={triggerRef}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            aria-label="Open profile menu"
            aria-expanded={open}
            aria-controls="candidate-profile"
            onClick={() => setOpen(true)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {initials}
            </span>
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
        id="candidate-profile"
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
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{me?.full_name || "Candidate"}</p>
              <p className="text-xs text-slate-500">{me?.email || ""}</p>
              <p className="text-xs text-slate-500">{profile?.location || ""}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              to="/candidate/dashboard"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              View Profile
            </Link>
            <Link
              to="/candidate/dashboard"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Settings
            </Link>
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
