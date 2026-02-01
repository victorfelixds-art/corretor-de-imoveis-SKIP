import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

export function Example() {
  const slides = [
    {
      title: 'Capa Impactante',
      img: 'https://img.usecurling.com/p/600/800?q=real%20estate%20brochure%20cover&color=black',
    },
    {
      title: 'Detalhes do Imóvel',
      img: 'https://img.usecurling.com/p/600/800?q=property%20details%20page&color=black',
    },
    {
      title: 'Valores Claros',
      img: 'https://img.usecurling.com/p/600/800?q=pricing%20table%20document&color=black',
    },
  ]

  return (
    <section id="example" className="py-20 bg-[#0B0F19] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB]">
              Veja como fica uma proposta criada no pdfcorretor
            </h2>
            <p className="text-[#9CA3AF] text-lg leading-relaxed">
              Propostas completas com fotos do imóvel, valores organizados,
              condições de pagamento e apresentação profissional — prontas para
              enviar no WhatsApp e acelerar a decisão.
            </p>
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                <Link to="/auth/signup">Criar minha primeira proposta</Link>
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center">
            <Carousel className="w-full max-w-xs md:max-w-sm">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="bg-transparent border-none shadow-none">
                        <CardContent className="flex aspect-[3/4] items-center justify-center p-0 overflow-hidden rounded-xl border border-[#1F2937] shadow-2xl relative">
                          <img
                            src={slide.img}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 p-3 text-center">
                            <span className="text-white font-medium">
                              {slide.title}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/50 border-none text-white hover:bg-black/70" />
              <CarouselNext className="right-2 bg-black/50 border-none text-white hover:bg-black/70" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
