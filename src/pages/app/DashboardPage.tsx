import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
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
import { useSidebar } from '@/components/ui/sidebar'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('this-month')
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

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
  const conversionRate =
    generatedCount > 0 ? (acceptedCount / generatedCount) * 100 : 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Visão Geral
        </h1>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Esse mês</SelectItem>
              <SelectItem value="all-time">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/app/proposals/new')}>
            Nova Proposta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">
              {isMobile ? 'Geradas' : 'Propostas Geradas'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{generatedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">
              {isMobile ? 'P. Ajustes' : 'Pediu Ajustes'}
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-orange-600">
              {adjustmentCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">
              {isMobile ? 'Aceitas' : 'Propostas Aceitas'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600">
              {conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">Possível</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div
              className="text-lg font-bold text-blue-600 truncate"
              title={formatCurrency(possibleValue)}
            >
              {formatCurrency(possibleValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">Provável</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div
              className="text-lg font-bold text-green-700 truncate"
              title={formatCurrency(probableValue)}
            >
              {formatCurrency(probableValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Propostas Recentes</CardTitle>
            <CardDescription>
              {filteredProposals.length === 0
                ? 'Nenhuma proposta encontrada neste período.'
                : `Últimas ${Math.min(5, filteredProposals.length)} propostas.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProposals.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-full',
                        p.status === 'Aceita'
                          ? 'bg-emerald-100 text-emerald-600'
                          : p.status === 'Pediu ajustes'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      <FileText className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {p.property?.name || 'Imóvel Excluído'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.client_name} -{' '}
                        {formatCurrency(Number(p.final_price))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        p.status === 'Aceita'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Pediu ajustes'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-slate-100 text-slate-800',
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/app/properties/new')}
            >
              <FileText className="mr-2 size-4" /> Cadastrar Imóvel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/app/proposals/new')}
            >
              <FileText className="mr-2 size-4" /> Gerar Proposta
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/app/library')}
            >
              <FileText className="mr-2 size-4" /> Ver Biblioteca
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
