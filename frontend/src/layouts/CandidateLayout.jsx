import CandidateHeader from "../components/CandidateHeader";

export default function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen">
      <CandidateHeader />
      {children}
    </div>
  );
}
