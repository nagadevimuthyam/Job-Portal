import { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function SkillsEditor({ skills, onAdd, onRemove }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const cleaned = value.trim();
    if (!cleaned) return;
    onAdd(cleaned);
    setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && (
          <p className="text-sm text-ink-faint">No skills yet. Add your strengths.</p>
        )}
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
          >
            {skill.name}
            <button
              type="button"
              className="text-ink-faint hover:text-ink"
              onClick={() => onRemove(skill.id)}
              aria-label={`Remove ${skill.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Input
          label="Add skill"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="React, Django, SQL"
        />
        <div className="self-end">
          <Button type="button" onClick={handleAdd}>
            Add Skill
          </Button>
        </div>
      </div>
    </div>
  );
}
