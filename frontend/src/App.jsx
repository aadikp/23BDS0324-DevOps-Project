import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import DiscoveryPage       from './pages/DiscoveryPage'
import ItineraryPlannerPage from './pages/ItineraryPlannerPage'
import AdminDashboard      from './pages/AdminDashboard'

// ─── Guard: requires ROLE_ADMIN ───────────────────────────────────────────────
function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/" replace />
}

// ─── App shell ────────────────────────────────────────────────────────────────
function AppShell() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"        element={<DiscoveryPage />} />
          <Route path="/planner" element={<ItineraryPlannerPage />} />
          <Route path="/admin"   element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          {/* Catch-all → Discovery */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
