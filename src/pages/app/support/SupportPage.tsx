import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageCircle } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-[800px] mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="text-secondary mt-1">Como podemos ajudar você hoje?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" /> WhatsApp
            </CardTitle>
            <CardDescription>
              Resposta rápida em horário comercial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Iniciar Conversa
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" /> Email
            </CardTitle>
            <CardDescription>
              Para dúvidas técnicas ou financeiras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              suporte@pdfcorretor.com
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envie uma mensagem</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo e entraremos em contato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Assunto</Label>
            <Input placeholder="Sobre o que você quer falar?" />
          </div>
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea
              placeholder="Descreva sua dúvida ou problema..."
              className="min-h-[120px]"
            />
          </div>
          <Button className="w-full sm:w-auto">Enviar Mensagem</Button>
        </CardContent>
      </Card>
    </div>
  )
}
