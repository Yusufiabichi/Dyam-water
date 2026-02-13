
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';
import HeroSection from './components/HeroSection';
import AboutPreview from './components/AboutPreview';
import ProductShowcase from './components/ProductShowcase';
import DistributionPreview from './components/DistributionPreview';
import GallerySection from './components/GallerySection';
import CharityHighlight from './components/CharityHighlight';

const HomePage = () => {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DYAM Natural Water - Premium Bottled Water Lagos Nigeria",
    "description": "NAFDAC certified premium bottled water for homes, offices, and events. Free charity water distribution to mosques, churches, hospitals across Nigeria.",
    "url": "https://dyamwater.com/",
    "mainEntity": {
      "@type": "Product",
      "name": "DYAM Natural Water",
      "description": "Premium NAFDAC certified bottled water available in 35cl, 50cl, 75cl, and 15L sizes.",
      "brand": { "@type": "Brand", "name": "DYAM Natural Water" },
      "category": "Bottled Water",
      "countryOfOrigin": { "@type": "Country", "name": "Nigeria" }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="DYAM Natural Water | Premium Bottled Water Lagos Nigeria"
        description="DYAM Natural Water delivers NAFDAC certified premium bottled water across Lagos and Nigeria. Safe drinking water for homes, offices, events, and free charity water distribution to mosques, churches, hospitals."
        keywords="DYAM Natural Water, bottled water Nigeria, premium water Lagos, NAFDAC certified water, charity water distribution"
        canonicalPath="/"
        structuredData={homeStructuredData}
      />
      <Navbar />
      <main>
        <HeroSection />
        <AboutPreview />
        <ProductShowcase />
        <DistributionPreview />
        <GallerySection />
        <CharityHighlight />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
