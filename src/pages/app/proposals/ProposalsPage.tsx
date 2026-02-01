import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, ExternalLink, Calendar, User } from 'lucide-react'
import { proposalsService } from '@/services/proposals'
import useAuthStore from '@/stores/useAuthStore'
import { Proposal } from '@/types'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function ProposalsPage() {
  const { user } = useAuthStore()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) loadProposals()
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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Propostas</h1>
          <p className="text-secondary mt-1">
            Histórico de documentos gerados.
          </p>
        </div>
        <Button onClick={() => navigate('/app/proposals/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando propostas...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="text-lg font-medium text-foreground">
            Nenhuma proposta gerada
          </h3>
          <p className="text-sm text-secondary mt-2">
            Gere sua primeira proposta profissional agora.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate('/app/proposals/new')}
          >
            Gerar Proposta
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary"
            >
              <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-none">
                      {proposal.property?.name || 'Imóvel indisponível'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {proposal.client_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />{' '}
                        {format(new Date(proposal.created_at), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      Valor Final
                    </div>
                    <div className="font-bold text-lg">
                      {formatCurrency(proposal.final_price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(proposal.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/app/proposals/${proposal.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
