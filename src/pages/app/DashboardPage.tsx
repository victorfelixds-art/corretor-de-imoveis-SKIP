import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { proposalsService } from '@/services/proposals'
import useAuthStore from '@/stores/useAuthStore'
import { Proposal } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import { isSameMonth, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('this-month')
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadProposals()
    }
  }, [user])

  const loadProposals = async () => {
    setLoading(true)
    try {
      const data = await proposalsService.list(user!.id)
      setProposals(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProposals = proposals.filter((p) => {
    if (dateFilter === 'this-month') {
      return isSameMonth(parseISO(p.created_at), new Date())
    }
    return true // all time
  })

  // Metrics
  const generatedCount = filteredProposals.length
  const adjustmentCount = filteredProposals.filter(
    (p) => p.status === 'Pediu ajustes',
  ).length
  const acceptedCount = filteredProposals.filter(
    (p) => p.status === 'Aceita',
  ).length

  const possibleValue = filteredProposals.reduce(
    (sum, p) => sum + Number(p.final_price),
    0,
  )
  const probableValue = filteredProposals
    .filter((p) => p.status === 'Aceita')
    .reduce((sum, p) => sum + Number(p.final_price), 0)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aceita':
        return <Badge variant="success">Aceita</Badge>
      case 'Pediu ajustes':
        return <Badge variant="warning">Ajustes</Badge>
      default:
        return <Badge variant="default">Gerada</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Visão Geral
          </h1>
          <p className="text-secondary mt-1">
            Acompanhe o desempenho das suas propostas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Esse mês</SelectItem>
              <SelectItem value="all-time">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => navigate('/app/proposals/new')}
            className="shadow-lg shadow-blue-500/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Proposta
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Propostas Geradas
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedCount}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pediu Ajustes
            </CardTitle>
            <Clock className="h-4 w-4 text-[hsl(38,92%,50%)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(38,92%,50%)]">
              {adjustmentCount}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Propostas Aceitas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-[hsl(160,84%,39%)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(160,84%,39%)]">
              {acceptedCount}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Possível
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div
              className="text-xl font-bold text-foreground truncate"
              title={formatCurrency(possibleValue)}
            >
              {formatCurrency(possibleValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Provável
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div
              className="text-xl font-bold text-emerald-600 truncate"
              title={formatCurrency(probableValue)}
            >
              {formatCurrency(probableValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Propostas Recentes</CardTitle>
            <CardDescription>
              {filteredProposals.length === 0
                ? 'Nenhuma atividade recente.'
                : `Últimas movimentações.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredProposals.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded-lg transition-colors',
                        p.status === 'Aceita'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                          : p.status === 'Pediu ajustes'
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30',
                      )}
                    >
                      <FileText className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p
                        className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => navigate(`/app/proposals/${p.id}`)}
                      >
                        {p.property?.name || 'Imóvel Excluído'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.client_name} •{' '}
                        {formatCurrency(Number(p.final_price))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">{getStatusBadge(p.status)}</div>
                </div>
              ))}
              {filteredProposals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-muted/50 rounded-full p-3 mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Nenhuma proposta encontrada
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    Crie sua primeira proposta para visualizar aqui.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Atalhos para suas tarefas</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              variant="secondary"
              className="w-full justify-start h-12 text-left font-normal"
              onClick={() => navigate('/app/properties/new')}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded mr-3 text-blue-600">
                <Building2 className="size-4" />
              </div>
              Cadastrar Imóvel
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start h-12 text-left font-normal"
              onClick={() => navigate('/app/proposals/new')}
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded mr-3 text-emerald-600">
                <FileText className="size-4" />
              </div>
              Nova Proposta
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start h-12 text-left font-normal"
              onClick={() => navigate('/app/library')}
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded mr-3 text-purple-600">
                <Library className="size-4" />
              </div>
              Biblioteca de Layouts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Icon import helper
import { Building2, Library } from 'lucide-react'
