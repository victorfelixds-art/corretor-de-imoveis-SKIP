import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function AdminPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Planos e Assinaturas
        </h1>
        <p className="text-muted-foreground">Gerenciamento global de planos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Planos</CardTitle>
          <CardDescription>
            Atualmente os planos são gerenciados via código e Stripe. Para
            gerenciar a assinatura de um usuário específico, acesse a aba
            "Usuários".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            Funcionalidade de gestão global de planos em desenvolvimento. Use a
            gestão de usuários para overrides individuais.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
