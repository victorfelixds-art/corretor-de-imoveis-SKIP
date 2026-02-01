import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { proposalsService } from '@/services/proposals'
import { Proposal } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Home, AlertTriangle, Send, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProposalPreviewPage() {
  const { id } = useParams()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      proposalsService
        .getById(id)
        .then(setProposal)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div>Carregando preview...</div>
  if (!proposal) return <div>Proposta não encontrada</div>

  const handleStatusAction = async (status: 'Aceita' | 'Pediu ajustes') => {
    try {
      await proposalsService.updateStatus(proposal.id, status)

      // WhatsApp Logic
      const phone = '5511999999999' // Mock Agent Number
      const text =
        status === 'Aceita'
          ? `Olá, gostaria de aceitar a proposta do imóvel ${proposal.property?.name}.`
          : `Olá, gostaria de solicitar ajustes na proposta do imóvel ${proposal.property?.name}.`

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

      toast({
        title: 'Status atualizado',
        description: 'Redirecionando para WhatsApp...',
      })

      // Open in new tab
      window.open(url, '_blank')

      // Refresh local state
      setProposal({ ...proposal, status })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar status' })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Proposta #{proposal.id.slice(0, 8)}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app')}>
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          <Button onClick={() => window.alert('Download simulado iniciado')}>
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center p-8 overflow-hidden relative">
        <img
          src={proposal.pdf_url || ''}
          alt="PDF Preview"
          className="max-h-full shadow-2xl rounded-sm border-8 border-white"
        />
        <div className="absolute bottom-4 right-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => window.open('https://wa.me/551100000000', '_blank')}
          >
            <AlertTriangle className="mr-2 h-4 w-4" /> Reportar Erro
          </Button>
        </div>
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-bold">Simulação de Ações do Cliente:</span>
            <br />
            Teste os botões que o cliente veria na página pública.
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              onClick={() => handleStatusAction('Pediu ajustes')}
            >
              <Send className="mr-2 h-4 w-4" /> Pedir Ajustes
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleStatusAction('Aceita')}
            >
              <Check className="mr-2 h-4 w-4" /> Aceitar Proposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
