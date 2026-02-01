import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap } from 'lucide-react'

export default function PlansPage() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Planos e Assinaturas
        </h1>
        <p className="text-secondary mt-2 text-lg">
          Escolha o plano ideal para escalar suas vendas.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Free Plan */}
        <Card className="flex flex-col relative overflow-hidden border-border/60">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <CardDescription>Para começar a testar</CardDescription>
            <div className="text-3xl font-bold mt-4">Grátis</div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" /> 1 Proposta /
                mês
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" /> Layout Básico
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check className="mr-2 h-4 w-4 text-muted-foreground/50" />{' '}
                Suporte por email
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Plano Atual
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col relative overflow-hidden border-primary shadow-lg scale-105 z-10">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">Profissional</CardTitle>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <CardDescription>Para corretores ativos</CardDescription>
            <div className="text-3xl font-bold mt-4">
              R$ 49,90
              <span className="text-sm font-normal text-muted-foreground">
                /mês
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> 20 Propostas /
                mês
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Todos Layouts
                Base
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" /> Remoção da Marca
                d'água
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Assinar Agora</Button>
          </CardFooter>
        </Card>

        {/* Business Plan */}
        <Card className="flex flex-col relative overflow-hidden border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Unlimited{' '}
              <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            </CardTitle>
            <CardDescription>Para imobiliárias e top producers</CardDescription>
            <div className="text-3xl font-bold mt-4">
              R$ 99,90
              <span className="text-sm font-normal text-muted-foreground">
                /mês
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" /> Propostas
                Ilimitadas
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" /> Layouts
                Premium (Pro+)
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" /> Suporte
                Prioritário
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Falar com Consultor
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
