import { Button } from '@/components/ui/button'
import useAuthStore from '@/stores/useAuthStore'
import { Shield, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export function AdminSwitcher() {
  const { user } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Only render for admins
  if (!user || user.role !== 'admin') return null

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="flex items-center gap-3 ml-auto">
      <Badge
        variant={isAdminRoute ? 'destructive' : 'secondary'}
        className="hidden md:flex border-none"
      >
        {isAdminRoute ? 'Modo Admin' : 'Modo Corretor'}
      </Badge>
      <Button
        size="sm"
        variant={isAdminRoute ? 'outline' : 'destructive'}
        onClick={() => navigate(isAdminRoute ? '/app' : '/admin')}
        className="gap-2 shadow-sm"
      >
        {isAdminRoute ? (
          <>
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Visualizar como corretor</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Ir para painel admin</span>
          </>
        )}
      </Button>
    </div>
  )
}
