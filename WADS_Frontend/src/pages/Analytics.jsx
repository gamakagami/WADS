import { useAuthContext } from "../contexts/AuthContext";
import { AdminDashboardProvider } from "../contexts/AdminDashboardContext";
import AnalyticsDashboard from "../components/app/AnalyticsDashboard";

function Analytics() {
  const { user } = useAuthContext();

  return (
    <>
      {user.role === "admin" && (
        <AdminDashboardProvider>
          <AnalyticsDashboard />
        </AdminDashboardProvider>
      )}
    </>
  );
}

export default Analytics;
