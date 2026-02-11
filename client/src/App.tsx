import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import FamilyListPage from './pages/FamilyListPage';
import FamilyDetailPage from './pages/FamilyDetailPage';
import FamilyFormPage from './pages/FamilyFormPage';
import MemberFormPage from './pages/MemberFormPage';
import UserManagementPage from './pages/UserManagementPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="families" element={<FamilyListPage />} />
            <Route path="families/new" element={<FamilyFormPage />} />
            <Route path="families/:id" element={<FamilyDetailPage />} />
            <Route path="families/:id/edit" element={<FamilyFormPage />} />
            <Route path="families/:familyId/members/new" element={<MemberFormPage />} />
            <Route path="families/:familyId/members/:memberId/edit" element={<MemberFormPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
