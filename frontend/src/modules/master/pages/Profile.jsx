import { useSelector } from "react-redux";
import Card from "../../../components/ui/Card";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Profile</h1>
        <p className="text-sm text-ink-faint">Your master admin account details.</p>
      </div>
      <Card>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-ink-faint">Full Name</p>
            <p className="font-semibold text-ink">{user?.full_name || "Master Admin"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Email</p>
            <p className="font-semibold text-ink">{user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Role</p>
            <p className="font-semibold text-ink">{user?.role || "MASTER_ADMIN"}</p>
          </div>
          <div>
            <p className="text-ink-faint">Phone</p>
            <p className="font-semibold text-ink">{user?.phone || "-"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
