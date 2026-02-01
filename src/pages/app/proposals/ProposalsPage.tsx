import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, ExternalLink } from 'lucide-react'
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
    }).format(val)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aceita':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'Pediu ajustes':
        return 'bg-orange-500 hover:bg-orange-600'
      default:
        return 'bg-slate-500 hover:bg-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Propostas Geradas</h1>
        <Button onClick={() => navigate('/app/proposals/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhuma proposta gerada
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Gere sua primeira proposta profissional agora.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate('/app/proposals/new')}
          >
            Gerar Proposta
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {proposal.property?.name || 'Imóvel indisponível'}
                    </CardTitle>
                    <CardDescription>
                      Cliente: {proposal.client_name}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Valor Final</p>
                    <p className="font-medium">
                      {formatCurrency(proposal.final_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Data</p>
                    <p className="font-medium">
                      {format(new Date(proposal.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Layout</p>
                    <p className="font-medium">{proposal.layout_id}</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/proposals/${proposal.id}`)}
                    >
                      Ver Detalhes <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
