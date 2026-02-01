import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-[#0B0F19]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#F9FAFB] mb-4">
            Planos simples para seu volume
          </h2>
          <p className="text-[#9CA3AF]">
            Você escolhe apenas quantas propostas quer gerar por mês.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Base */}
          <Card className="bg-[#111827] border-[#1F2937] flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#F9FAFB]">Base</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">
                R$ 29,90
                <span className="text-sm font-normal text-[#9CA3AF]">/mês</span>
              </div>
              <p className="text-[#9CA3AF] text-sm mt-2">
                Para quem está começando
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> 20
                  propostas/mês
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Acesso total
                  à plataforma
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Layouts Base
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#1F2937] text-[#F9FAFB] hover:bg-[#1F2937]"
              >
                <Link to="/auth/signup">Começar agora</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro */}
          <Card className="bg-[#111827] border-blue-600 shadow-2xl shadow-blue-900/20 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#2563EB]" />
            <div className="absolute top-4 right-4 bg-[#2563EB] text-white text-xs font-bold px-2 py-1 rounded">
              MAIS ESCOLHIDO
            </div>
            <CardHeader>
              <CardTitle className="text-[#F9FAFB]">Pro</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">
                R$ 49,90
                <span className="text-sm font-normal text-[#9CA3AF]">/mês</span>
              </div>
              <p className="text-[#9CA3AF] text-sm mt-2">
                Ideal para corretores ativos
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> 60
                  propostas/mês
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Tudo do plano
                  Base
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Remoção de
                  marca d'água
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                <Link to="/auth/signup">Começar agora</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro+ */}
          <Card className="bg-[#111827] border-[#1F2937] flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#F9FAFB]">Pro+</CardTitle>
              <div className="text-3xl font-bold text-white mt-4">
                R$ 79,90
                <span className="text-sm font-normal text-[#9CA3AF]">/mês</span>
              </div>
              <p className="text-[#9CA3AF] text-sm mt-2">
                Volume alto e exclusividade
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> 120
                  propostas/mês
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Layouts
                  Exclusivos Pro+
                </li>
                <li className="flex items-center text-[#E5E7EB] text-sm">
                  <Check className="mr-2 h-4 w-4 text-blue-500" /> Suporte
                  Prioritário
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#1F2937] text-[#F9FAFB] hover:bg-[#1F2937]"
              >
                <Link to="/auth/signup">Começar agora</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center text-[#9CA3AF] text-sm">
          <p>
            Precisa de mais? Pacote extra de{' '}
            <span className="text-white font-medium">
              20 propostas por R$ 24,90
            </span>{' '}
            (acumulam e não expiram).
          </p>
        </div>
      </div>
    </section>
  )
}
