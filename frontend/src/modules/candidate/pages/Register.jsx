import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import PublicLayout from "../../../layouts/PublicLayout";
import { useRegisterCandidateMutation } from "../../../features/candidate/candidateApi";

const schema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(6, "Mobile number is required"),
});

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

export default function CandidateRegister() {
  const navigate = useNavigate();
  const [registerCandidate, { isLoading }] = useRegisterCandidateMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerCandidate(data).unwrap();
      toast.success("Profile created. Please log in.", { duration: 4500 });
      navigate("/candidate/login");
    } catch (err) {
      const fieldError =
        err?.data && typeof err.data === "object" ? Object.values(err.data)[0]?.[0] : null;
      const message = err?.data?.detail || fieldError || "Registration failed.";
      toast.error(message);
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-ink">Create your candidate account</h1>
          <p className="mt-2 text-sm text-ink-faint">Build a profile recruiters can trust.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              placeholder="Your name"
              helperText="As mentioned on official documents"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            <Input
              label="Email ID"
              type="email"
              placeholder="you@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
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
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Register"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="flex items-center gap-3 text-xs text-ink-faint">
              <span className="h-px flex-1 bg-surface-3" />
              or continue with
              <span className="h-px flex-1 bg-surface-3" />
            </div>
            <Button variant="outline" className="mt-4 w-full" disabled>
              Google (coming soon)
            </Button>
          </div>
          <p className="mt-4 text-sm text-ink-faint">
            Already have an account? <Link className="font-semibold text-brand-700" to="/candidate/login">Login</Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
