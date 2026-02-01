import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-[#1F2937] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#F9FAFB]">
              pdfcorretor
            </span>
          </div>

          <div className="flex gap-6 text-sm text-[#9CA3AF]">
            <Link to="/terms" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <a
              href="mailto:contato@pdfcorretor.com"
              className="hover:text-white transition-colors"
            >
              Contato
            </a>
          </div>

          <div className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} PDFCorretor. Todos os direitos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
