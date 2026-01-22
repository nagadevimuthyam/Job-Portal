import PublicHeader from "../components/PublicHeader";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      {children}
    </div>
  );
}
