import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans text-[#F9FAFB] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-[#2563EB]">
          Termos de Uso
        </h1>
        <div className="space-y-6 text-[#9CA3AF] leading-relaxed">
          <p>
            Bem-vindo ao PDFCorretor. Ao acessar e usar nossa plataforma, você
            concorda com os termos descritos abaixo. Se você não concordar com
            qualquer parte destes termos, por favor, não use nossos serviços.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            1. Uso da Plataforma
          </h2>
          <p>
            O PDFCorretor é uma ferramenta para geração de propostas
            imobiliárias. Você é responsável por todas as informações inseridas
            nas propostas, incluindo dados de imóveis, valores e informações de
            clientes.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            2. Contas e Segurança
          </h2>
          <p>
            Você é responsável por manter a confidencialidade da sua conta e
            senha. Notifique-nos imediatamente sobre qualquer uso não autorizado
            da sua conta.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            3. Planos e Pagamentos
          </h2>
          <p>
            Os serviços são oferecidos mediante assinatura ou compra de
            créditos. Os pagamentos são processados de forma segura. Não há
            reembolso para créditos já consumidos na geração de documentos.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            4. Propriedade Intelectual
          </h2>
          <p>
            Os layouts e o design da plataforma são propriedade exclusiva do
            PDFCorretor. Os dados inseridos por você pertencem a você.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            5. Limitação de Responsabilidade
          </h2>
          <p>
            O PDFCorretor não se responsabiliza por negócios perdidos ou
            informações incorretas inseridas pelos usuários nas propostas.
          </p>

          <p className="mt-12 text-sm text-[#6B7280]">
            Última atualização: 01 de Fevereiro de 2026.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
