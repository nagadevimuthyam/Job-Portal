import SectionCard from "../shared/SectionCard";

export default function SectionWrapper({ title, description, actions, children }) {
  return (
    <SectionCard title={title} description={description} actions={actions}>
      <div className="space-y-4">{children}</div>
    </SectionCard>
  );
}
