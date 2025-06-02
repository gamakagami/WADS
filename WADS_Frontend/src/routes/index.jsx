import { Routes, Route, Navigate } from "react-router-dom";
import Error from "../components/app/Error";
import AppLayout from "../components/app/AppLayout";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import NotificationsPage from "../pages/NotificationsPage";
import Setting from "../pages/Setting";
import ForumPage from "../pages/ForumPage";
import SignUpPage from "../pages/SignUpPage";
import ValidationPage from "../pages/ValidationPage";
import Chatbot from "../pages/Chatbot";
import LoginPage from "../pages/LogInPage";
import Analytics from "../pages/Analytics";
import Tickets from "../pages/Tickets";
import TicketDetailsPage from "../pages/TicketDetailsPage";
import UserManagement from "../pages/UserManagement";
import UserDetailsPage from "../pages/UserDetailsPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import GoogleCallback from "../features/auth/GoogleCallback";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute reverse={true}>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute reverse={true}>
            <SignUpPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute reverse={true}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/validate"
        element={
          <ProtectedRoute reverse={true}>
            <ValidationPage />
          </ProtectedRoute>
        }
      />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
        errorElement={<Error />}
      >
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
