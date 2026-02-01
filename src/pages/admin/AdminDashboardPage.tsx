import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  Activity,
  ShieldAlert,
} from 'lucide-react'
import { adminService } from '@/services/admin'
import { AdminLog } from '@/types'
import { format } from 'date-fns'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    usersCount: 0,
    activeUsersCount: 0,
    proposalsCount: 0,
    acceptedProposalsCount: 0,
    totalCreditsUsed: 0,
  })
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats()
      const recentLogs = await adminService.getLogs()
      setStats(dashboardStats)
      setLogs(recentLogs)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando dashboard...</div>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-destructive">
        Visão Geral da Plataforma
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsersCount} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propostas Geradas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proposalsCount}</div>
            <p className="text-xs text-muted-foreground">Global</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propostas Aceitas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.acceptedProposalsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de{' '}
              {stats.proposalsCount > 0
                ? (
                    (stats.acceptedProposalsCount / stats.proposalsCount) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Créditos Consumidos
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCreditsUsed}</div>
            <p className="text-xs text-muted-foreground">Total histórico</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Logs de Atividade Administrativa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum log registrado.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {log.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.action_type} •{' '}
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    {log.action_type.includes('ROLE') ||
                    log.action_type.includes('CREDIT') ? (
                      <ShieldAlert className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground mb-2">
              Atalhos do sistema
            </p>
            <a
              href="/admin/users"
              className="text-sm font-medium text-primary hover:underline"
            >
              Gerenciar Usuários
            </a>
            <a
              href="/admin/layouts"
              className="text-sm font-medium text-primary hover:underline"
            >
              Biblioteca de Layouts
            </a>
            <a
              href="/admin/settings"
              className="text-sm font-medium text-primary hover:underline"
            >
              Configurações Globais
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
