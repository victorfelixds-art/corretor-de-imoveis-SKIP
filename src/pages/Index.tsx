import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Positioning } from '@/components/landing/Positioning'
import { Example } from '@/components/landing/Example'
import { Benefits } from '@/components/landing/Benefits'
import { Testimonials } from '@/components/landing/Testimonials'
import { TargetAudience } from '@/components/landing/TargetAudience'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Calculator } from '@/components/landing/Calculator'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans text-[#F9FAFB] selection:bg-blue-500/30">
      <Header />
      <main>
        <Hero />
        <Positioning />
        <Example />
        <Benefits />
        <Testimonials />
        <TargetAudience />
        <HowItWorks />
        <Calculator />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
