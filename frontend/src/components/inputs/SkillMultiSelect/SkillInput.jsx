import Input from "../../ui/Input";

export default function SkillInput({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  error,
}) {
  return (
    <Input
      label="Add skill"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      error={error}
      className={error ? "border-danger focus:border-danger focus:ring-danger/20" : undefined}
    />
  );
}
