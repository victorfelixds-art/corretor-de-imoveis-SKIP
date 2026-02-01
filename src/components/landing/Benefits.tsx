import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, UserCircle, Image } from 'lucide-react'

export function Benefits() {
  const benefits = [
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: 'Propostas claras e organizadas',
      text: 'Seu cliente entende rápido o imóvel, os valores e as condições. Menos dúvidas, mais decisões.',
    },
    {
      icon: <UserCircle className="h-6 w-6 text-blue-500" />,
      title: 'Sua identidade profissional',
      text: 'Nome, CRECI e contato apresentados com clareza em cada proposta. Você passa confiança.',
    },
    {
      icon: <Image className="h-6 w-6 text-blue-500" />,
      title: 'Imagens que vendem',
      text: 'Fotos bem posicionadas valorizam o imóvel e reduzem a negociação “no escuro”.',
    },
  ]

  return (
    <section className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#F9FAFB] text-center mb-12">
          O que muda quando você usa o pdfcorretor
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <Card
              key={i}
              className="bg-[#0B0F19] border-[#1F2937] hover:border-blue-500/50 transition-colors"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <CardTitle className="text-[#F9FAFB]">{b.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#9CA3AF] leading-relaxed">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
