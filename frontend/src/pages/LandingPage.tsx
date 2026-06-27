import { HeroSection } from '../components/landing/HeroSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ChatWidget } from '../components/chatbot/ChatWidget';

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <BenefitsSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};
