import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/stores/useAuthStore'

import Index from './pages/Index'
import SignUpPage from './pages/auth/SignUpPage'
import RecoveryPage from './pages/auth/RecoveryPage'
import DashboardPage from './pages/app/DashboardPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import NotFound from './pages/NotFound'

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
          {/* Public / Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/recovery" element={<RecoveryPage />} />
          </Route>

          {/* Corretor Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route
              path="properties"
              element={<div className="p-4">Propriedades (Em Breve)</div>}
            />
            <Route
              path="proposals"
              element={<div className="p-4">Propostas (Em Breve)</div>}
            />
            <Route
              path="credits"
              element={<div className="p-4">Créditos (Em Breve)</div>}
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="users"
              element={<div className="p-4">Gerenciar Usuários (Em Breve)</div>}
            />
            <Route
              path="plans"
              element={<div className="p-4">Gerenciar Planos (Em Breve)</div>}
            />
            <Route
              path="layouts"
              element={<div className="p-4">Gerenciar Layouts (Em Breve)</div>}
            />
            <Route
              path="settings"
              element={<div className="p-4">Configurações (Em Breve)</div>}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
