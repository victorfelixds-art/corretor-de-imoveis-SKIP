import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'Exemplo', href: '#example' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Como funciona?', href: '#how-it-works' },
    { name: 'Calculadora', href: '#calculator' },
    { name: 'Preços', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled
          ? 'bg-[#0B0F19]/90 backdrop-blur-md border-[#1F2937] py-3'
          : 'bg-transparent py-5',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#F9FAFB] tracking-tight">
            pdfcorretor
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-[#F9FAFB] hover:text-[#2563EB] transition-colors"
          >
            Já tenho conta
          </Link>
          <Button
            asChild
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-lg shadow-blue-900/20"
          >
            <Link to="/auth/signup">Criar proposta agora</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#F9FAFB]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0B0F19] border-b border-[#1F2937] p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#2563EB] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-[#1F2937] my-2" />
          <Link
            to="/auth/login"
            className="text-sm font-medium text-[#F9FAFB] hover:text-[#2563EB] py-2"
          >
            Já tenho conta
          </Link>
          <Button
            asChild
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            <Link to="/auth/signup">Criar proposta agora</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
