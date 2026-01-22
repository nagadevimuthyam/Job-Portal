import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLoginMutation } from "../../../features/auth/authApi";
import { setCredentials } from "../../../features/auth/authSlice";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import { BRANDING } from "../../../config/branding";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});

export default function MasterLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user?.role === "MASTER_ADMIN") {
      navigate("/master/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          accessToken: result.access,
          refreshToken: result.refresh,
          user: result.user,
        })
      );
      toast.success("Welcome back, Master Admin.", { duration: 5000 });
      navigate("/master/dashboard");
    } catch (err) {
      const message = err?.data?.detail || "Login failed. Check credentials.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img src={BRANDING.logo} alt={BRANDING.product} className="mx-auto h-12 w-12" />
          <h1 className="mt-4 text-2xl font-bold text-ink">Master Admin Login</h1>
          <p className="text-sm text-ink-faint">Manage organizations and employer access.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="admin@company.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
