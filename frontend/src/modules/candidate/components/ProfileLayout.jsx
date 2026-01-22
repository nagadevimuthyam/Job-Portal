export default function ProfileLayout({ top, sidebar, children }) {
  return (
    <div className="space-y-6">
      {top && <div className="lg:hidden">{top}</div>}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden space-y-4 lg:block">{sidebar}</aside>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
