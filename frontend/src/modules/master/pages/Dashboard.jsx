import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import { useGetDashboardQuery } from "../../../features/master/masterApi";
import Skeleton from "../../../components/ui/Skeleton";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardQuery();

  const metrics = [
    { label: "Total Organizations", value: data?.total_organizations ?? "--" },
    { label: "Total Employer Users", value: data?.total_employers ?? "--" },
    { label: "Total Candidates", value: data?.total_candidates ?? "--" },
    { label: "Active Organizations", value: data?.active_organizations ?? "--" },
    { label: "Inactive Organizations", value: data?.inactive_organizations ?? "--" },
  ];

  const orgColumns = [
    { key: "name", label: "Organization" },
    { key: "code", label: "Code" },
    { key: "employer_count", label: "Employers" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge label={row.is_active ? "Active" : "Inactive"} tone={row.is_active ? "success" : "danger"} />
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
    },
  ];

  const employerColumns = [
    { key: "full_name", label: "Employer" },
    { key: "email", label: "Email" },
    { key: "org_name", label: "Organization" },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
    },
  ];

  const candidateColumns = [
    { key: "full_name", label: "Candidate" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Master Dashboard</h1>
        <p className="text-sm text-ink-faint">
          Total Candidates counts candidates created in the Candidate portal across all organizations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-ink-faint">{metric.label}</p>
            {isLoading ? (
              <Skeleton className="mt-4 h-8 w-20" />
            ) : (
              <p className="mt-3 text-3xl font-bold text-ink">{metric.value}</p>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Recent Organizations</h2>
          <Table columns={orgColumns} data={data?.recent_organizations || []} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Recent Employers</h2>
          <Table columns={employerColumns} data={data?.recent_employers || []} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Recent Candidates</h2>
          <Table columns={candidateColumns} data={data?.recent_candidates || []} />
        </div>
      </div>
    </div>
  );
}
