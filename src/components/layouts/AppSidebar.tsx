import {
  Home,
  FileText,
  CreditCard,
  User,
  LogOut,
  Building2,
  Library,
  HelpCircle,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import useAuthStore from '@/stores/useAuthStore'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/app' && location.pathname === '/app') return true
    if (path !== '/app' && location.pathname.startsWith(path)) return true
    return false
  }

  // Exact order: 1. Dashboard, 2. Imóveis, 3. Propostas, 4. Biblioteca, 5. Planos, 6. Suporte, 7. Perfil
  const menuItems = [
    { title: 'Dashboard', url: '/app', icon: Home },
    { title: 'Imóveis', url: '/app/properties', icon: Building2 },
    { title: 'Propostas', url: '/app/proposals', icon: FileText },
    { title: 'Biblioteca', url: '/app/library', icon: Library },
    { title: 'Planos', url: '/app/plans', icon: CreditCard },
    { title: 'Suporte', url: '/app/support', icon: HelpCircle },
    { title: 'Perfil', url: '/app/profile', icon: User },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  PDFCorretor
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Área do Corretor
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        'relative transition-all duration-200',
                        active
                          ? 'text-primary bg-blue-50 dark:bg-blue-950/20 font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Link to={item.url}>
                        {/* Lateral Indicator for Active State */}
                        {active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                        )}
                        <item.icon className={cn(active && 'text-primary')} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sair"
              className="text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-2 py-2 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium truncate text-foreground">
                  {user?.name || 'Usuário'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
