import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProposalActionPage() {
  const { id, action } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const performAction = async () => {
      if (!id || !action) return

      try {
        const { data, error } = await supabase.functions.invoke(
          'update-proposal-status',
          {
            body: { proposal_id: id, action },
          },
        )

        if (error) throw new Error(error.message || 'Failed to update status')

        setStatus('success')

        // Redirect to WhatsApp after short delay
        if (data?.whatsappUrl) {
          setTimeout(() => {
            window.location.href = data.whatsappUrl
          }, 1500)
        }
      } catch (err: any) {
        console.error(err)
        setStatus('error')
        setErrorMsg(err.message || 'Ocorreu um erro ao processar sua ação.')
      }
    }

    performAction()
  }, [id, action])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>
            {action === 'accept' ? 'Aceitando Proposta' : 'Solicitando Ajustes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground text-center">
                Estamos processando sua resposta e conectando com o corretor...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center font-medium">Sucesso!</p>
              <p className="text-muted-foreground text-center text-sm">
                Redirecionando para o WhatsApp...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-center font-medium text-destructive">Erro</p>
              <p className="text-muted-foreground text-center text-sm">
                {errorMsg}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
