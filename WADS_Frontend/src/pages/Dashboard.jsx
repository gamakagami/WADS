import UserDashboard from "../components/app/UserDashboard";
import AgentDashboard from "../components/app/AgentDashboard";
import AdminDashboard from "../components/app/AdminDashboard";
import { useAuthContext } from "../contexts/AuthContext";
import { AdminDashboardProvider } from "../contexts/AdminDashboardContext";
import { AgentDashboardProvider } from "../contexts/AgentDashboardContext";

function Dashboard() {
  const { user } = useAuthContext();

  return (
    <>
      {user.role === "admin" && (
        <AdminDashboardProvider>
          <AdminDashboard />
        </AdminDashboardProvider>
      )}
      {user.role === "agent" && <AgentDashboardProvider><AgentDashboard /></AgentDashboardProvider>}
      {user.role === "user" && <UserDashboard />}
    </>
  );
}

export default Dashboard;
