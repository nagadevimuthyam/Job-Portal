import Card from "../../../../../components/ui/Card";
import Button from "../../../../../components/ui/Button";
import Input from "../../../../../components/ui/Input";

export default function SearchFormCard({
  resultCount,
  saveName,
  onSaveNameChange,
  onSaveSearch,
  children,
}) {
  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Candidate Search</h1>
          <p className="text-sm text-ink-faint">Search across the candidate database.</p>
        </div>
        <p className="text-sm text-ink-faint">Results: {resultCount}</p>
      </div>

      {children}

      <div className="border-t border-surface-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-[240px]">
            <Input
              label="Save Search Name"
              placeholder="Frontend in Bengaluru"
              value={saveName}
              onChange={(event) => onSaveNameChange(event.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onSaveSearch}>
              Save Search
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
