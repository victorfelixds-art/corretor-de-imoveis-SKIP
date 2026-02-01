import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans text-[#F9FAFB] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-[#2563EB]">
          Política de Privacidade
        </h1>
        <div className="space-y-6 text-[#9CA3AF] leading-relaxed">
          <p>
            Sua privacidade é importante para nós. Esta política explica como
            coletamos, usamos e protegemos suas informações.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            1. Informações Coletadas
          </h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como nome,
            email, telefone, CRECI e dados dos imóveis que você cadastra na
            plataforma.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            2. Uso das Informações
          </h2>
          <p>Usamos suas informações para:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Processar transações e enviar avisos relacionados;</li>
            <li>Gerar os documentos PDF solicitados por você;</li>
            <li>Enviar comunicações técnicas e de suporte.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            3. Compartilhamento de Dados
          </h2>
          <p>
            Não vendemos seus dados pessoais. Compartilhamos informações apenas
            com prestadores de serviços necessários para a operação da
            plataforma (ex: processamento de pagamentos, envio de emails).
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            4. Segurança
          </h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para
            proteger seus dados contra acesso não autorizado ou alteração.
          </p>

          <h2 className="text-xl font-semibold text-[#F9FAFB] mt-8">
            5. Seus Direitos
          </h2>
          <p>
            Você pode acessar, corrigir ou excluir suas informações pessoais a
            qualquer momento através do painel de controle ou entrando em
            contato com nosso suporte.
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
