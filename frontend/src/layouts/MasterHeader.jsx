import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BRANDING } from "../config/branding";
import { logout } from "../features/auth/authSlice";
import Badge from "../components/ui/Badge";

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CollapseIcon = ({ collapsed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {collapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
  </svg>
);

export default function MasterHeader({ collapsed, onToggleCollapse, onToggleMobile }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "MA";

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-surface-3 bg-surface-inverse/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobile}
            className="rounded-lg p-2 text-ink lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-2 text-ink lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
          <div className="flex items-center gap-3">
            <img src={BRANDING.logo} alt={BRANDING.product} className="h-9 w-9" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Master Admin</p>
              <p className="text-base font-semibold text-ink">{BRANDING.product}</p>
            </div>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-full border border-surface-3 bg-surface-inverse px-4 py-2 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-xs text-ink-faint">Hi, {user?.full_name || "Master"}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">Admin</p>
                <Badge label="Master" tone="neutral" />
              </div>
            </div>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-surface-3 bg-surface-inverse p-2 shadow-soft">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/master/profile");
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/master/profile");
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
              >
                My Account
              </button>
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/master/login");
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
