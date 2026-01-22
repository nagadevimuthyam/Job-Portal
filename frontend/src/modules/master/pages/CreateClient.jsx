import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import {
  useCreateOrganizationMutation,
  useCreateEmployerMutation,
} from "../../../features/master/masterApi";

const schema = z.object({
  organization_name: z.string().min(2, "Organization name is required"),
  organization_code: z.string().optional(),
  employer_name: z.string().min(2, "Employer name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is mandatory"),
  phone: z.string().min(6, "Phone is required"),
  address: z.string().min(3, "Address is required"),
  contact_number: z.string().min(6, "Contact number is required"),
});

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*";
  let result = "";
  for (let i = 0; i < 12; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M2 12s4-6 10-6c2.2 0 4.2.7 6 1.7" />
        <path d="M22 12s-4 6-10 6c-2.2 0-4.2-.7-6-1.7" />
      </>
    )}
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <rect x="2" y="2" width="13" height="13" rx="2" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v6h-6" />
  </svg>
);

export default function CreateClient() {
  const navigate = useNavigate();
  const [createOrganization] = useCreateOrganizationMutation();
  const [createEmployer, { isLoading }] = useCreateEmployerMutation();
  const [suggested, setSuggested] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const orgPayload = {
        name: data.organization_name,
        code: data.organization_code || "",
        address: data.address || "",
        contact_number: data.contact_number,
        is_active: true,
      };
      const org = await createOrganization(orgPayload).unwrap();
      await createEmployer({
        organization_id: org.id,
        full_name: data.employer_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address || "",
      }).unwrap();
      toast.success("Client organization and employer created.", { duration: 5200 });
      navigate("/master/employers");
    } catch (err) {
      const fieldError =
        err?.data && typeof err.data === "object" ? Object.values(err.data)[0]?.[0] : null;
      const message = err?.data?.detail || fieldError || "Failed to create client.";
      toast.error(message);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggested);
    toast.success("Suggested password copied.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Create Client</h1>
        <p className="text-sm text-ink-faint">Create an organization and its first employer login.</p>
      </div>
      <Card>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Organization Name"
            placeholder="Nova Staffing Pvt Ltd"
            error={errors.organization_name?.message}
            {...register("organization_name")}
          />
          <Input
            label="Organization Code"
            placeholder="NOVA01"
            helperText="Optional. Leave blank to auto-generate."
            error={errors.organization_code?.message}
            {...register("organization_code")}
          />
          <Input
            label="Employer Full Name"
            placeholder="Avery Larson"
            error={errors.employer_name?.message}
            {...register("employer_name")}
          />
          <Input
            label="Email"
            placeholder="admin@novastaffing.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  className="text-ink-faint hover:text-ink"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
              {...register("password")}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-ink-soft">Suggested Password:</span>
              <button
                type="button"
                onClick={() => setValue("password", suggested, { shouldValidate: true })}
                className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 font-semibold text-brand-700"
              >
                {suggested}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-surface-3 bg-surface-inverse p-2 text-ink-soft hover:text-ink"
                title="Copy"
              >
                <CopyIcon />
              </button>
              <button
                type="button"
                onClick={() => setSuggested(generatePassword())}
                className="rounded-full border border-surface-3 bg-surface-inverse p-2 text-ink-soft hover:text-ink"
                title="Refresh"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Address"
            placeholder="Street, City, State"
            error={errors.address?.message}
            {...register("address")}
          />
          <Input
            label="Contact Number"
            placeholder="Office line"
            error={errors.contact_number?.message}
            {...register("contact_number")}
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
