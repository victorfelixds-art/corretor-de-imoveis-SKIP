import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Quote } from 'lucide-react'

export function Testimonials() {
  const items = [
    {
      name: 'Ricardo Silva',
      role: 'Corretor Autônomo',
      text: 'Meus clientes elogiam a organização. Fechei duas vendas semana passada porque a proposta estava muito clara.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    },
    {
      name: 'Juliana Mendes',
      role: 'Imobiliária Mendes',
      text: 'Antes eu perdia tempo formatando no Word. Agora em 2 minutos a proposta está pronta e linda.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    },
    {
      name: 'Carlos Eduardo',
      role: 'Corretor de Alto Padrão',
      text: 'Para imóveis de alto ticket, a apresentação é tudo. O pdfcorretor elevou meu nível de jogo.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-[#0B0F19]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-4">
          Corretores que já estão fechando mais
        </h2>
        <p className="text-[#9CA3AF] mb-12 max-w-2xl mx-auto">
          A diferença aparece na resposta do cliente — e no seu fechamento.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {items.map((item, i) => (
            <Card key={i} className="bg-[#111827] border-[#1F2937] relative">
              <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center h-full">
                <Quote className="absolute top-4 left-4 h-6 w-6 text-[#2563EB] opacity-30" />
                <p className="text-[#E5E7EB] text-sm mb-6 flex-1 italic">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={item.img} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#F9FAFB]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          asChild
          size="lg"
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
        >
          <Link to="/auth/signup">Criar proposta agora</Link>
        </Button>
      </div>
    </section>
  )
}
