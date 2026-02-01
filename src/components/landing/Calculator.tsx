import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function Calculator() {
  const [proposals, setProposals] = useState([20])
  const [value, setValue] = useState(500000)

  // Simulation Logic
  // Assuming 10% closing rate vs 2% standard
  const standardConversion = 0.02
  const proConversion = 0.06 // 3x improvement

  const potentialStandard = proposals[0] * standardConversion * value
  const potentialPro = proposals[0] * proConversion * value
  const difference = potentialPro - potentialStandard

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <section id="calculator" className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F9FAFB] mb-4">
              Faça uma simulação rápida
            </h2>
            <p className="text-[#9CA3AF]">
              Veja quanto dinheiro você pode estar deixando na mesa por causa de
              propostas ruins.
            </p>
          </div>

          <Card className="bg-[#0B0F19] border-[#1F2937]">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[#F9FAFB] text-base">
                      Quantas propostas você envia por mês?{' '}
                      <span className="text-[#2563EB] font-bold">
                        {proposals[0]}
                      </span>
                    </Label>
                    <Slider
                      value={proposals}
                      onValueChange={setProposals}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F9FAFB] text-base">
                      Valor médio do imóvel (R$)
                    </Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="bg-[#111827] border-[#1F2937] text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="p-4 rounded-lg bg-[#111827] border border-[#1F2937]">
                    <p className="text-sm text-[#9CA3AF] mb-1">
                      Volume de Vendas (Comum)
                    </p>
                    <p className="text-xl font-semibold text-[#E5E7EB]">
                      {formatMoney(potentialStandard)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-900/10 border border-blue-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <ArrowUpRight className="h-12 w-12 text-blue-500" />
                    </div>
                    <p className="text-sm text-blue-300 mb-1">
                      Potencial com PDFCorretor
                    </p>
                    <p className="text-2xl font-bold text-[#2563EB]">
                      {formatMoney(potentialPro)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-emerald-500 font-medium">
                      +{formatMoney(difference)} em potencial vendas
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1F2937]">
                <p className="text-xs text-[#6B7280]">
                  *Estimativas baseadas em aumento de conversão médio de 3x.
                  Resultados variam por região e oferta.
                </p>
                <Button
                  asChild
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white whitespace-nowrap"
                >
                  <Link to="/auth/signup">Criar proposta agora</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
