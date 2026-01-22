import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

export default function CandidateLogin() {
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
    if (user?.role === "CANDIDATE") {
      navigate("/candidate/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      if (result.user?.role !== "CANDIDATE") {
        dispatch(logout());
        toast.error("Candidate access only.");
        return;
      }
      dispatch(
        setCredentials({
          accessToken: result.access,
          refreshToken: result.refresh,
          user: result.user,
        })
      );
      toast.success("Welcome back.", { duration: 4500 });
      navigate("/candidate/dashboard");
    } catch (err) {
      const message = err?.data?.detail || "Login failed. Check credentials.";
      toast.error(message);
    }
  };

  return (
    <PublicLayout>
      <div className="grid min-h-[calc(100vh-80px)] items-center gap-8 px-6 py-12 lg:grid-cols-2">
        <div className="hidden rounded-3xl bg-brand-50 p-10 text-ink lg:block">
          <h2 className="text-3xl font-bold">Find the right job faster.</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Keep your profile updated and let employers discover your achievements.
          </p>
        </div>
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-ink">Candidate Login</h1>
          <p className="mt-2 text-sm text-ink-faint">Continue to your dashboard.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email ID"
              type="email"
              placeholder="you@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-ink-faint">
            New here? <Link className="font-semibold text-brand-700" to="/candidate/register">Create an account</Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
