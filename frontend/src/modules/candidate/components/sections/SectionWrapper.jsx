import ProfileSectionCard from "../ProfileSectionCard";

export default function SectionWrapper({ title, description, actions, children }) {
  return (
    <ProfileSectionCard title={title} description={description} actions={actions}>
      <div className="space-y-4">{children}</div>
    </ProfileSectionCard>
  );
}
