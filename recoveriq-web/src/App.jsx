import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import RunbookList from "./RunbookList";
import RunbookForm from "./RunbookForm";
import MyDrillsPlaceholder from "./MyDrillsPlaceholder";
import DrillListPlaceholder from "./DrillListPlaceholder";
import ProtectedRoute from "./ProtectedRoute";
import { getSession } from "./auth";

function RootRedirect() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === "Admin") return <Navigate to="/runbooks" replace />;
  return <Navigate to="/my-drills" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        <Route path="/runbooks" element={
          <ProtectedRoute allowedRole="Admin"><RunbookList /></ProtectedRoute>
        } />
        <Route path="/runbooks/new" element={
          <ProtectedRoute allowedRole="Admin"><RunbookForm /></ProtectedRoute>
        } />
        <Route path="/runbooks/:id/edit" element={
          <ProtectedRoute allowedRole="Admin"><RunbookForm /></ProtectedRoute>
        } />
        <Route path="/drills" element={
          <ProtectedRoute allowedRole="Admin"><DrillListPlaceholder /></ProtectedRoute>
        } />

        <Route path="/my-drills" element={
          <ProtectedRoute allowedRole="TeamMember"><MyDrillsPlaceholder /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}