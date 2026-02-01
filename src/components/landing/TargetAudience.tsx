import { Check } from 'lucide-react'

export function TargetAudience() {
  const list = [
    'Corretores autônomos',
    'Imobiliárias pequenas e médias',
    'Quem envia proposta pelo WhatsApp',
    'Quem quer padrão e organização',
  ]

  return (
    <section className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">
            Feito para corretores e pequenas imobiliárias
          </h2>
          <p className="text-[#9CA3AF] text-lg mb-8">
            Não importa se você trabalha sozinho ou tem uma equipe. Se você
            precisa enviar propostas rápidas, bonitas e que convertem, o
            pdfcorretor é para você.
          </p>
          <ul className="space-y-4">
            {list.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[#E5E7EB]">
                <div className="h-6 w-6 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://img.usecurling.com/p/600/400?q=team%20meeting%20office&color=black"
            alt="Corretores trabalhando"
            className="rounded-lg shadow-2xl border border-[#1F2937] grayscale opacity-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
