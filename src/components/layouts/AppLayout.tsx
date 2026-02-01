import { Outlet, Navigate, useLocation } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import useAuthStore from '@/stores/useAuthStore'
import { Separator } from '@/components/ui/separator'

export default function AppLayout() {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (user.role !== 'corretor') {
    return <Navigate to="/admin" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>Bem-vindo, {user.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
