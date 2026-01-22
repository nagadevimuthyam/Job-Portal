import { useState } from "react";
import MasterHeader from "./MasterHeader";
import MasterSidebar from "./MasterSidebar";

export default function MasterLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <MasterHeader
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />
      <MasterSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main
        className={`px-6 pb-10 pt-24 transition-all duration-300 ${
          collapsed ? "lg:pl-28" : "lg:pl-72"
        }`}
      >
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
