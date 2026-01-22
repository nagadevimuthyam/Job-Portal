import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Skeleton from "../../../components/ui/Skeleton";
import { useGetOrganizationsQuery } from "../../../features/master/masterApi";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Organizations() {
  const [search, setSearch] = useState("");
  const { data = [], isLoading } = useGetOrganizationsQuery(search);

  const columns = [
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
      label: "Created Date",
      render: (row) => formatDate(row.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Organizations</h1>
          <p className="text-sm text-ink-faint">Track all client organizations onboarded.</p>
        </div>
        <div className="w-full md:w-64">
          <Input
            label="Search"
            placeholder="Search by name or code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <Card>
        {isLoading ? <Skeleton className="h-40 w-full" /> : <Table columns={columns} data={data} />}
      </Card>
    </div>
  );
}
