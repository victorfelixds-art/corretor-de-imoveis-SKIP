import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/stores/useAuthStore'

import Index from './pages/Index'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import RecoveryPage from './pages/auth/RecoveryPage'
import DashboardPage from './pages/app/DashboardPage'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/users/AdminUsersPage'
import AdminPlansPage from './pages/admin/plans/AdminPlansPage'
import AdminLayoutsPage from './pages/admin/layouts/AdminLayoutsPage'
import AdminProposalsPage from './pages/admin/proposals/AdminProposalsPage'
import AdminSettingsPage from './pages/admin/settings/AdminSettingsPage'

// New Pages
import PropertiesPage from './pages/app/properties/PropertiesPage'
import NewPropertyPage from './pages/app/properties/NewPropertyPage'
import ProposalsPage from './pages/app/proposals/ProposalsPage'
import NewProposalPage from './pages/app/proposals/NewProposalPage'
import ProposalPreviewPage from './pages/app/proposals/ProposalPreviewPage'
import LibraryPage from './pages/app/library/LibraryPage'
import PlansPage from './pages/app/plans/PlansPage'
import SupportPage from './pages/app/support/SupportPage'
import ProfilePage from './pages/app/profile/ProfilePage'
import ProposalActionPage from './pages/public/ProposalActionPage'

import AuthLayout from './components/layouts/AuthLayout'
import AppLayout from './components/layouts/AppLayout'
import AdminLayout from './components/layouts/AdminLayout'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Landing Page (Standalone) */}
          <Route path="/" element={<Index />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/recovery" element={<RecoveryPage />} />
          </Route>

          {/* Public Action Routes (No Layout) */}
          <Route path="/p/:id/:action" element={<ProposalActionPage />} />
          <Route
            path="/r/:action/:proposalId"
            element={<ProposalActionPage />}
          />

          {/* Corretor Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />

            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/new" element={<NewPropertyPage />} />

            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="proposals/new" element={<NewProposalPage />} />
            <Route path="proposals/:id" element={<ProposalPreviewPage />} />

            <Route path="library" element={<LibraryPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route
              path="credits"
              element={<div className="p-4">Créditos (Em Breve)</div>}
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="plans" element={<AdminPlansPage />} />
            <Route path="layouts" element={<AdminLayoutsPage />} />
            <Route path="proposals" element={<AdminProposalsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
