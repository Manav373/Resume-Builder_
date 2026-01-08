import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppSignedIn, AppSignedOut, AppSignIn, AppSignUp } from "@/components/auth-provider"

import DashboardLayout from './layouts/dashboard-layout'
import DashboardPage from './pages/dashboard'
import CreateResumePage from './pages/resume/create'
import ResumesPage from './pages/dashboard/resumes'
import EditResumePage from './pages/resume/edit'
import PortfoliosPage from './pages/dashboard/portfolios'
import SettingsPage from './pages/dashboard/settings'

import LandingPage from './pages/landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/sign-in/*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <AppSignIn routing="path" path="/sign-in" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <AppSignUp routing="path" path="/sign-up" />
          </div>
        } />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <>
              <AppSignedIn>
                <DashboardLayout />
              </AppSignedIn>
              <AppSignedOut>
                <Navigate to="/sign-in" replace />
              </AppSignedOut>
            </>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="resumes/:id/edit" element={<EditResumePage />} />
          <Route path="resumes/new" element={<CreateResumePage />} />
          <Route path="portfolios" element={<PortfoliosPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
