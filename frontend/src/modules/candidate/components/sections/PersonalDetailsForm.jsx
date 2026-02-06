import Input from "../../../../components/ui/Input";
import FieldError from "./FieldError";

export default function PersonalDetailsForm({ draft, onChange, errors }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Input
          label="Full Name"
          value={draft.full_name}
          onChange={(event) => onChange({ ...draft, full_name: event.target.value })}
        />
        <FieldError message={errors.full_name} />
      </div>
      <div>
        <Input
          label="Email"
          type="email"
          value={draft.email}
          onChange={(event) => onChange({ ...draft, email: event.target.value })}
        />
        <FieldError message={errors.email} />
      </div>
      <div>
        <Input
          label="Phone"
          value={draft.phone}
          onChange={(event) => onChange({ ...draft, phone: event.target.value })}
        />
        <FieldError message={errors.phone} />
      </div>
      <div>
        <Input
          label="Location"
          value={draft.location}
          onChange={(event) => onChange({ ...draft, location: event.target.value })}
        />
        <FieldError message={errors.location} />
      </div>
      <div>
        <Input
          label="Experience Years"
          type="number"
          value={draft.total_experience_years}
          onChange={(event) =>
            onChange({ ...draft, total_experience_years: event.target.value })
          }
        />
        <FieldError message={errors.total_experience_years} />
      </div>
      <div>
        <Input
          label="Experience Months"
          type="number"
          value={draft.total_experience_months}
          onChange={(event) =>
            onChange({ ...draft, total_experience_months: event.target.value })
          }
        />
        <FieldError message={errors.total_experience_months} />
      </div>
      <div>
        <Input
          label="Notice Period (days)"
          type="number"
          value={draft.notice_period_days}
          onChange={(event) => onChange({ ...draft, notice_period_days: event.target.value })}
        />
        <FieldError message={errors.notice_period_days} />
      </div>
      <div>
        <Input
          label="Expected Salary"
          type="number"
          value={draft.expected_salary}
          onChange={(event) => onChange({ ...draft, expected_salary: event.target.value })}
        />
        <FieldError message={errors.expected_salary} />
      </div>
    </div>
  );
}
