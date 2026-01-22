import PublicLayout from "../../../layouts/PublicLayout";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function Landing() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-ink md:text-5xl">
              Discover roles that match your skills and ambition.
            </h1>
            <p className="text-base text-ink-soft">
              Search verified opportunities, build a standout profile, and get discovered by top recruiters.
            </p>
            <div className="grid gap-3 rounded-2xl border border-surface-3 bg-surface-inverse/90 p-4 shadow-soft md:grid-cols-[1fr_1fr_180px_150px]">
              <input
                className="rounded-xl border border-surface-3 bg-surface-inverse px-4 py-3 text-sm"
                placeholder="Skills or job title"
                aria-label="Search by skills or job title"
              />
              <input
                className="rounded-xl border border-surface-3 bg-surface-inverse px-4 py-3 text-sm"
                placeholder="Location"
                aria-label="Search by location"
              />
              <select
                className="rounded-xl border border-surface-3 bg-surface-inverse px-4 py-3 text-sm"
                aria-label="Experience level"
              >
                <option>Experience</option>
                <option>0-1 years</option>
                <option>2-4 years</option>
                <option>5-8 years</option>
                <option>8+ years</option>
              </select>
              <Button className="w-full">Search Jobs</Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-ink-faint">
              <span>Trusted by 2,000+ employers</span>
              <span>Verified profiles</span>
              <span>Career insights</span>
            </div>
          </div>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">Featured Companies</h2>
            <div className="grid gap-3">
              {["Orion Tech", "Northwind", "Pulse Health", "Kite Labs"].map((company) => (
                <div key={company} className="flex items-center justify-between rounded-xl border border-surface-3 px-4 py-3">
                  <span className="text-sm font-semibold text-ink">{company}</span>
                  <span className="text-xs text-ink-faint">Hiring now</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Popular Categories</h2>
          <Button variant="ghost">View All</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {["Product & Design", "Engineering", "Marketing", "Sales", "Operations", "Finance"].map((category) => (
            <Card key={category} className="space-y-2">
              <h3 className="text-base font-semibold text-ink">{category}</h3>
              <p className="text-sm text-ink-faint">Curated roles for fast-growing teams.</p>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
