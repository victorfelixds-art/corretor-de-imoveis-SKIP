import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#F9FAFB] mb-6">
          Valorize seus imóveis antes mesmo da visita.
        </h2>
        <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto">
          Uma proposta profissional não é custo. É ferramenta de venda. Comece
          agora e envie propostas que passam confiança.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-14 px-10 text-lg shadow-2xl shadow-blue-600/30"
        >
          <Link to="/auth/signup">Criar proposta agora</Link>
        </Button>
      </div>
    </section>
  )
}
