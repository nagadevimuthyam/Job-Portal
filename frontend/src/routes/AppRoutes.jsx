import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

import MasterLayout from "../layouts/MasterLayout";
import EmployerLayout from "../layouts/EmployerLayout";

const MasterLogin = lazy(() => import("../modules/master/pages/Login"));
const MasterDashboard = lazy(() => import("../modules/master/pages/Dashboard"));
const MasterCreateClient = lazy(() => import("../modules/master/pages/CreateClient"));
const MasterOrganizations = lazy(() => import("../modules/master/pages/Organizations"));
const MasterEmployers = lazy(() => import("../modules/master/pages/Employers"));
const MasterProfile = lazy(() => import("../modules/master/pages/Profile"));

const EmployerLogin = lazy(() => import("../modules/employer/pages/Login"));
const EmployerSearch = lazy(() => import("../modules/employer/pages/Search"));
const EmployerCandidateProfile = lazy(() => import("../modules/employer/pages/CandidateProfile"));
const EmployerJobs = lazy(() => import("../modules/employer/pages/Jobs"));
const EmployerCampaign = lazy(() => import("../modules/employer/pages/Campaign"));
const EmployerFolders = lazy(() => import("../modules/employer/pages/Folders"));
const EmployerReports = lazy(() => import("../modules/employer/pages/Reports"));
const EmployerProfile = lazy(() => import("../modules/employer/pages/Profile"));

const Landing = lazy(() => import("../modules/candidate/pages/Landing"));
const CandidateLogin = lazy(() => import("../modules/candidate/pages/Login"));
const CandidateRegister = lazy(() => import("../modules/candidate/pages/Register"));
const CandidateDashboard = lazy(() => import("../modules/candidate/pages/Dashboard"));

function RequireRole({ roles, children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center text-sm text-ink-faint">Loading...</div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/register" element={<CandidateRegister />} />
          <Route
            path="/candidate/dashboard"
            element={
              <RequireRole roles={["CANDIDATE"]}>
                <CandidateDashboard />
              </RequireRole>
            }
          />

          <Route path="/master/login" element={<MasterLogin />} />
          <Route path="/master" element={<Navigate to="/master/dashboard" replace />} />
          <Route
            path="/master/dashboard"
            element={
              <RequireRole roles={["MASTER_ADMIN"]}>
                <MasterLayout>
                  <MasterDashboard />
                </MasterLayout>
              </RequireRole>
            }
          />
          <Route
            path="/master/create-client"
            element={
              <RequireRole roles={["MASTER_ADMIN"]}>
                <MasterLayout>
                  <MasterCreateClient />
                </MasterLayout>
              </RequireRole>
            }
          />
          <Route
            path="/master/organizations"
            element={
              <RequireRole roles={["MASTER_ADMIN"]}>
                <MasterLayout>
                  <MasterOrganizations />
                </MasterLayout>
              </RequireRole>
            }
          />
          <Route
            path="/master/employers"
            element={
              <RequireRole roles={["MASTER_ADMIN"]}>
                <MasterLayout>
                  <MasterEmployers />
                </MasterLayout>
              </RequireRole>
            }
          />
          <Route
            path="/master/profile"
            element={
              <RequireRole roles={["MASTER_ADMIN"]}>
                <MasterLayout>
                  <MasterProfile />
                </MasterLayout>
              </RequireRole>
            }
          />

          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route
            path="/employer/search"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerSearch />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerJobs />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/campaign"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerCampaign />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/folders"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerFolders />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/reports"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerReports />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerProfile />
                </EmployerLayout>
              </RequireRole>
            }
          />
          <Route
            path="/employer/candidates/:id"
            element={
              <RequireRole roles={["EMPLOYER"]}>
                <EmployerLayout>
                  <EmployerCandidateProfile />
                </EmployerLayout>
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
