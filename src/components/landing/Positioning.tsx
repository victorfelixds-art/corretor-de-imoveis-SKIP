import { Card, CardContent } from '@/components/ui/card'
import { X, Check } from 'lucide-react'

export function Positioning() {
  return (
    <section className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">
            No final, o cliente escolhe só entre dois corretores.
          </h2>
          <p className="text-[#9CA3AF] text-lg">
            Um que parece amador. E outro que transmite profissionalismo,
            organização e confiança. A proposta que você envia diz muito sobre
            você. Qual impressão você quer causar?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Bad Example */}
          <Card className="bg-[#0B0F19] border border-red-900/30 shadow-none relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-600" />
            <CardContent className="p-8 flex flex-col items-center text-center h-full">
              <div className="h-12 w-12 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
                <X className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">
                Proposta comum / improvisada
              </h3>
              <p className="text-[#9CA3AF] text-sm mb-6">
                Feita no Word ou direto no corpo do WhatsApp. Sem padrão, sem
                fotos, confusa.
              </p>
              <div className="w-full bg-white/5 rounded p-4 text-xs text-left text-gray-500 font-mono space-y-2 mt-auto">
                <p>Oi, segue o valor do ap.</p>
                <p>R$ 500k.</p>
                <p>Tem piscina.</p>
                <p>Att, Corretor.</p>
              </div>
            </CardContent>
          </Card>

          {/* Good Example */}
          <Card className="bg-[#1F2937] border border-blue-500/30 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#2563EB]" />
            <CardContent className="p-8 flex flex-col items-center text-center h-full">
              <div className="h-12 w-12 rounded-full bg-blue-900/20 flex items-center justify-center mb-6">
                <Check className="h-6 w-6 text-[#2563EB]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">
                Proposta profissional (pdfcorretor)
              </h3>
              <p className="text-[#9CA3AF] text-sm mb-6">
                Design impecável, informações claras, fotos em alta resolução.
                Gera autoridade imediata.
              </p>
              <div className="w-full bg-[#0B0F19] rounded-lg border border-blue-500/20 p-1 overflow-hidden mt-auto">
                <img
                  src="https://img.usecurling.com/p/400/250?q=clean%20document%20layout&color=black"
                  alt="Professional Proposal"
                  className="w-full h-auto rounded opacity-90"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <a
            href="#example"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium text-sm hover:underline"
          >
            Ver exemplo real
          </a>
        </div>
      </div>
    </section>
  )
}
