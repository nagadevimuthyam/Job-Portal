import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/master/dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
  { label: "Organizations", to: "/master/organizations", icon: "M4 4h16v16H4z" },
  { label: "Create Client", to: "/master/create-client", icon: "M12 5v14M5 12h14" },
  { label: "Employers", to: "/master/employers", icon: "M7 7h10M7 11h10M7 15h6" },
  { label: "Profile", to: "/master/profile", icon: "M20 21c0-4-4-7-8-7s-8 3-8 7M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
];

const NavIcon = ({ path }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d={path} />
  </svg>
);

export default function MasterSidebar({ collapsed, mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r border-surface-3 bg-surface-inverse/90 px-3 py-6 backdrop-blur transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-600 text-surface-inverse shadow-soft"
                    : "text-ink hover:bg-surface-2"
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-ink group-hover:bg-surface-3">
                <NavIcon path={item.icon} />
              </span>
              <span className={`${collapsed ? "hidden" : "inline"}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
    </>
  );
}
