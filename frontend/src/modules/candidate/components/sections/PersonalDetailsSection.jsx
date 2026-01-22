import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";

export default function PersonalDetailsSection({
  profile,
  draft,
  setDraft,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <ProfileSectionCard
      title="Personal Details"
      description="Basic information recruiters need."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Details"
        />
      }
    >
      {isEditing ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            value={draft.full_name}
            onChange={(event) => setDraft({ ...draft, full_name: event.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={draft.email}
            onChange={(event) => setDraft({ ...draft, email: event.target.value })}
          />
          <Input
            label="Phone"
            value={draft.phone}
            onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
          />
          <Input
            label="Location"
            value={draft.location}
            onChange={(event) => setDraft({ ...draft, location: event.target.value })}
          />
          <Input
            label="Experience Years"
            type="number"
            value={draft.total_experience_years}
            onChange={(event) =>
              setDraft({ ...draft, total_experience_years: event.target.value })
            }
          />
          <Input
            label="Experience Months"
            type="number"
            value={draft.total_experience_months}
            onChange={(event) =>
              setDraft({ ...draft, total_experience_months: event.target.value })
            }
          />
          <Input
            label="Notice Period (days)"
            type="number"
            value={draft.notice_period_days}
            onChange={(event) => setDraft({ ...draft, notice_period_days: event.target.value })}
          />
          <Input
            label="Expected Salary"
            type="number"
            value={draft.expected_salary}
            onChange={(event) => setDraft({ ...draft, expected_salary: event.target.value })}
          />
        </div>
      ) : (
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-ink-faint">Name</p>
            <p className="font-semibold text-ink">{profile?.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Email</p>
            <p className="font-semibold text-ink">{profile?.email || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Phone</p>
            <p className="font-semibold text-ink">{profile?.phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Location</p>
            <p className="font-semibold text-ink">{profile?.location || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Experience</p>
            <p className="font-semibold text-ink">
              {profile?.total_experience_years || 0}y {profile?.total_experience_months || 0}m
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Notice Period</p>
            <p className="font-semibold text-ink">
              {profile?.notice_period_days ? `${profile.notice_period_days} days` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Expected Salary</p>
            <p className="font-semibold text-ink">
              {profile?.expected_salary ? `₹${profile.expected_salary}` : "-"}
            </p>
          </div>
        </div>
      )}
    </ProfileSectionCard>
  );
}
