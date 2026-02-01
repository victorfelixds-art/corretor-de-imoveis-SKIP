import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Plataforma #1 para Corretores
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F9FAFB] mb-6 leading-[1.1]">
            Transforme suas propostas imobiliárias em{' '}
            <span className="text-[#2563EB]">vendas fechadas</span>.
          </h1>

          <p className="text-lg md:text-xl text-[#9CA3AF] mb-8 max-w-2xl leading-relaxed">
            Cansado de enviar PDFs simples, desorganizados e sem retorno? O
            pdfcorretor ajuda você a criar propostas profissionais que passam
            confiança, geram resposta e fecham mais negócios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
            <Button
              asChild
              size="lg"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-8 h-12 text-base shadow-xl shadow-blue-600/20"
            >
              <Link to="/auth/signup">
                Criar proposta agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#1F2937] text-[#F9FAFB] hover:bg-[#1F2937] hover:text-white h-12 px-8 bg-transparent"
            >
              <a href="#example">Ver exemplo</a>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>
              +3.000 corretores já usam o pdfcorretor para fechar mais imóveis
              todos os meses.
            </span>
          </div>
        </div>

        {/* Mockup Visual */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="relative rounded-xl bg-[#111827] border border-[#1F2937] shadow-2xl overflow-hidden aspect-[16/9]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="https://img.usecurling.com/p/1200/675?q=dashboard%20interface%20dark%20mode&color=black"
              alt="Dashboard Preview"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Floating Element Mobile */}
            <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-8 w-1/3 max-w-[240px] rounded-xl border border-[#1F2937] shadow-2xl z-20 overflow-hidden bg-[#0B0F19]">
              <img
                src="https://img.usecurling.com/p/300/600?q=mobile%20app%20interface%20dark&color=black"
                alt="Mobile Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  )
}
