import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";
import { useMeQuery } from "../../../features/auth/authApi";

export default function EmployerProfile() {
  const { data: me, isLoading } = useMeQuery();

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Employer Profile</h1>
        <p className="text-sm text-ink-faint">Manage your account details.</p>
      </div>
      <Card>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-ink-faint">Full Name</p>
            <p className="font-semibold text-ink">{me?.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Email</p>
            <p className="font-semibold text-ink">{me?.email || "-"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Phone</p>
            <p className="font-semibold text-ink">{me?.phone || "-"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Organization</p>
            <p className="font-semibold text-ink">{me?.organization?.name || "-"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
