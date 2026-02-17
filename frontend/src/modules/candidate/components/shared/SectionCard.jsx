import ProfileSectionCard from "../ProfileSectionCard";

export default function SectionCard({ title, description, actions, children }) {
  return (
    <ProfileSectionCard title={title} description={description} actions={actions}>
      {children}
    </ProfileSectionCard>
  );
}
