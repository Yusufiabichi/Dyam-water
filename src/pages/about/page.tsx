
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';

const AboutPage = () => {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About DYAM Natural Water",
    "description": "Learn about DYAM Natural Water, Nigeria\u0027s trusted bottled water brand combining quality hydration with community impact through charity water distribution.",
    "url": "https://dyamwater.com/about-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "DYAM Natural Water",
      "description": "Nigerian-owned bottled water brand operating a private-label production model, partnering with certified manufacturers.",
      "foundingLocation": { "@type": "Place", "name": "Lagos, Nigeria" }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="About DYAM Natural Water | Nigerian Bottled Water Brand Lagos"
        description="DYAM Natural Water is Nigeria\u0027s trusted bottled water brand combining quality hydration with community impact. NAFDAC certified, safe drinking water and charity distribution across Lagos."
        keywords="about DYAM water, Nigerian water brand, bottled water company Lagos, NAFDAC certified water brand"
        canonicalPath="/about-us"
        structuredData={aboutStructuredData}
      />
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <li><a href="/" className="hover:text-brand-500 transition-colors">Home</a></li>
                  <li>/</li>
                  <li className="text-gray-700">About</li>
                </ol>
              </nav>
              <h1 className="font-serif text-6xl lg:text-7xl text-gray-900 mb-6">About <strong>DYAM</strong></h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Nigeria&apos;s trusted <strong>bottled water brand</strong> combining quality hydration with community impact
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-2 flex items-center justify-center lg:justify-start">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider transform lg:rotate-0 lg:writing-mode-vertical">
                  Our Story
                </div>
              </div>
              
              <article className="lg:col-span-8">
                <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-8 leading-tight">
                  Who We Are
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    <strong className="text-navy-600">DYAM Natural Water</strong> is a Nigerian-owned <strong>bottled water brand</strong> 
                    operating a private-label production model, partnering with certified manufacturers while focusing 
                    on branding, distribution, and market expansion.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    We believe that access to clean, safe <strong>drinking water</strong> is a fundamental right. Through our innovative 
                    business model, we ensure that every bottle of DYAM water meets the highest quality standards while 
                    remaining affordable and accessible to all Nigerians.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our commitment extends beyond business. We&apos;ve built a <strong>distribution network</strong> that creates income 
                    opportunities for entrepreneurs across Nigeria, while our <strong>charity initiative</strong> ensures that vulnerable 
                    communities have access to free, clean water when they need it most.
                  </p>
                </div>
              </article>

              <div className="lg:col-span-2 flex items-center justify-center">
                <blockquote className="font-serif text-2xl italic text-ocean-600 leading-relaxed text-center lg:text-left">
                  &ldquo;Water is life, and giving is purpose&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="bg-primary-100 rounded-3xl p-12 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 flex items-center justify-center bg-ocean-500 rounded-2xl flex-shrink-0">
                  <i className="ri-telescope-line text-white text-3xl"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ocean-600 uppercase tracking-wider mb-3">Vision</div>
                  <h3 className="text-3xl font-semibold text-gray-900 leading-relaxed">
                    To become one of Nigeria&apos;s most trusted <strong>water brands</strong> while using water as a tool 
                    for community impact and charity.
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-lg border-l-8 border-ocean-500">
              <div className="text-xs font-semibold text-ocean-600 uppercase tracking-wider mb-6">Mission</div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-drop-fill text-ocean-500 text-2xl"></i>
                  </div>
                  <p className="text-xl text-gray-700">
                    Deliver safe and affordable <strong>drinking water</strong> to homes, businesses, and communities across Nigeria
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-drop-fill text-ocean-500 text-2xl"></i>
                  </div>
                  <p className="text-xl text-gray-700">
                    Create sustainable income opportunities through our extensive <strong>distribution network</strong>
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-drop-fill text-ocean-500 text-2xl"></i>
                  </div>
                  <p className="text-xl text-gray-700">
                    Support mosques, churches, schools, hospitals, and vulnerable communities with free water
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <article className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-ocean-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-line text-ocean-600 text-4xl"></i>
                </div>
                <h4><a href="/products" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Quality</a></h4>
                <p className="text-gray-600 mt-3">
                  NAFDAC certified water that meets the highest safety and purity standards
                </p>
              </article>

              <article className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-ocean-100 rounded-full flex items-center justify-center">
                  <i className="ri-hand-heart-line text-ocean-600 text-4xl"></i>
                </div>
                <h4><a href="/charity-water" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Compassion</a></h4>
                <p className="text-gray-600 mt-3">
                  Using our business to make a positive impact in communities that need it most
                </p>
              </article>

              <article className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-ocean-100 rounded-full flex items-center justify-center">
                  <i className="ri-team-line text-ocean-600 text-4xl"></i>
                </div>
                <h4><a href="/distribution-network" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Partnership</a></h4>
                <p className="text-gray-600 mt-3">
                  Building strong relationships with distributors, partners, and communities
                </p>
              </article>

              <article className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-ocean-100 rounded-full flex items-center justify-center">
                  <i className="ri-lightbulb-line text-ocean-600 text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Continuously improving our products, services, and social impact initiatives
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-navy-800 to-ocean-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
              Join Us in Making a Difference
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Whether as a distributor, partner, or charity sponsor, there&apos;s a place for you in the DYAM family
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/distribution-network"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-navy-700 px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg whitespace-nowrap"
              >
                Become a Distributor
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-navy-700 text-white px-8 py-4 rounded-full text-base font-medium transition-all whitespace-nowrap"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
