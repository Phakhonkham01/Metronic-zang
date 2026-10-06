import { FC, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
import { useAuth } from "../modules/auth";

const UsersPage = lazy(() => import("../modules/apps/user-management/UsersPage"));

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login */}
        <Route path="auth/*" element={<Navigate to="/dashboard" />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />
        {/* Lazy Modules */}
        {isAdmin && (
          <Route
            path="user-management/*"
            element={
              <SuspensedView>
                <UsersPage />
              </SuspensedView>
            }
          />
        )}
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
