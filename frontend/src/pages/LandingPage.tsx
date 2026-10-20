import { Nav } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { Problem } from '../components/landing/Problem';
import { Solution } from '../components/landing/Solution';
import { Workflow } from '../components/landing/Workflow';
import { ProductPreview } from '../components/landing/ProductPreview';
import { FourStates } from '../components/landing/FourStates';
import { Sources } from '../components/landing/Sources';
import { Scope } from '../components/landing/Scope';
import { Faq } from '../components/landing/Faq';
import { FinalCta } from '../components/landing/FinalCta';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Problem />
        <Solution />
        <Workflow />
        <ProductPreview />
        <FourStates />
        <Sources />
        <Scope />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
