import EmployerHeader from "../components/EmployerHeader";

export default function EmployerLayout({ children }) {
  return (
    <div className="min-h-screen">
      <EmployerHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
