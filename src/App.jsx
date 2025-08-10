import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getToken } from "./api/loginService";
import "./App.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const EmployeePage = lazy(() => import("./pages/EmployeePage"));

function RequireAuth({ children }) {
  const token = getToken();
  const location = useLocation();
  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireNoAuth({ children }) {
  const token = getToken();
  if (token) return <Navigate to="/employee" replace />;
  return children;
}

function EmployeeApp() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "#fff", textAlign: "center" }}>
          Loading Employee App...
        </div>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <RequireNoAuth>
              <LoginPage />
            </RequireNoAuth>
          }
        />
        <Route
          path="/employee"
          element={
            <RequireAuth>
              <EmployeePage />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={getToken() ? "/employee" : "/login"} replace />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default EmployeeApp;
