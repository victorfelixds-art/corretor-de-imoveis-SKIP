import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQ() {
  const items = [
    {
      q: 'Preciso de cartão de crédito para testar?',
      a: "Não. Você pode criar uma conta gratuita e ver como a plataforma funciona. Para gerar o PDF final sem marca d'água em volume, você escolhe um plano.",
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim. Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento direto no painel.',
    },
    {
      q: 'Consigo editar a proposta depois de gerada?',
      a: 'Sim. Você pode voltar, editar as informações e gerar um novo PDF sem custo adicional (se for a mesma proposta).',
    },
    {
      q: 'Meu cliente precisa se cadastrar?',
      a: 'Não. O seu cliente recebe apenas um arquivo PDF ou um link para visualizar. Ele não precisa baixar nada.',
    },
    {
      q: 'O que acontece se minhas propostas acabarem?',
      a: 'Você pode comprar pacotes avulsos de propostas que não expiram, ou fazer upgrade do seu plano.',
    },
  ]

  return (
    <section id="faq" className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-[#F9FAFB] text-center mb-12">
          Perguntas Frequentes
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-[#1F2937]"
            >
              <AccordionTrigger className="text-[#F9FAFB] hover:text-[#2563EB] text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#9CA3AF]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
