import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Cadastre o imóvel',
      text: 'Adicione fotos, endereço, metragem e os diferenciais que valorizam o imóvel.',
    },
    {
      num: '02',
      title: 'Escolha um layout',
      text: 'Selecione entre modelos profissionais testados para alta conversão.',
    },
    {
      num: '03',
      title: 'Envie para o cliente',
      text: 'Gere o PDF instantaneamente e compartilhe via WhatsApp ou Email.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-[#0B0F19]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#F9FAFB] text-center mb-16">
          Criar uma proposta leva poucos minutos
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent -z-0" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="h-24 w-24 rounded-full bg-[#111827] border-4 border-[#1F2937] flex items-center justify-center text-3xl font-bold text-[#2563EB] mb-6 shadow-xl">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-[#F9FAFB] mb-3">
                {step.title}
              </h3>
              <p className="text-[#9CA3AF] max-w-xs">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            asChild
            size="lg"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            <Link to="/auth/signup">Criar proposta agora</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
