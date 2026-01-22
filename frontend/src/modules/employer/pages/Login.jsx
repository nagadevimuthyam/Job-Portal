import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLoginMutation } from "../../../features/auth/authApi";
import { setCredentials, logout } from "../../../features/auth/authSlice";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import PublicLayout from "../../../layouts/PublicLayout";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});

export default function EmployerLogin() {
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
    if (user?.role === "EMPLOYER") {
      navigate("/employer/search");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      if (result.user?.role !== "EMPLOYER") {
        dispatch(logout());
        toast.error("Employer access only.");
        return;
      }
      dispatch(
        setCredentials({
          accessToken: result.access,
          refreshToken: result.refresh,
          user: result.user,
        })
      );
      toast.success("Welcome to the Employer Console.", { duration: 4500 });
      navigate("/employer/search");
    } catch (err) {
      const message = err?.data?.detail || "Login failed. Check credentials.";
      toast.error(message);
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-ink">Employer Login</h1>
            <p className="text-sm text-ink-faint">Search and engage verified candidates.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              placeholder="recruiter@company.com"
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
    </PublicLayout>
  );
}
