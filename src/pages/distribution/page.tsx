
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';
import { useState } from 'react';

const DistributionPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    businessType: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://readdy.ai/api/form/d65cgpn0ioc4omtka9gg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formDataToSend as any).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          location: '',
          businessType: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const distributionStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DYAM Water Distribution Network Nigeria",
    "description": "Join DYAM Natural Water distribution network across Lagos and Nigeria. 500+ distribution points, 25+ cities, become a water distributor today.",
    "url": "https://dyamwater.com/distribution-network"
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Water Distribution Network Lagos Nigeria | DYAM Natural Water"
        description="Join DYAM Natural Water distribution network with 500+ points across 25+ Nigerian cities. Become a water distributor in Lagos, Abuja, Kano. Attractive margins, full support, and flexible delivery."
        keywords="water distributor Nigeria, bottled water distribution Lagos, become water distributor, DYAM distribution network"
        canonicalPath="/distribution-network"
        structuredData={distributionStructuredData}
      />
      <Navbar />
      <main>
        {/* Hero Map Visualization */}
        <header className="pt-32 pb-20 bg-gradient-to-br from-navy-900 via-navy-800 to-ocean-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center justify-center space-x-2 text-sm text-white/60">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li>/</li>
                  <li className="text-white/90">Distribution</li>
                </ol>
              </nav>
              <h1 className="font-serif text-5xl lg:text-6xl text-white mb-6">
                <strong>Distribution Network</strong>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Join our growing network of <strong>water distributors</strong> bringing quality hydration to communities across Nigeria
              </p>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-ocean-300 mb-2">500+</div>
                <div className="text-white/80">Distribution Points</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-ocean-300 mb-2">25+</div>
                <div className="text-white/80">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-ocean-300 mb-2">1M+</div>
                <div className="text-white/80">Bottles Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-ocean-300 mb-2">200+</div>
                <div className="text-white/80">Active Distributors</div>
              </div>
            </div>

            {/* Map Illustration */}
            <div className="relative w-full h-96 mt-16">
              <img
                src="https://readdy.ai/api/search-image?query=stylized%20Nigeria%20map%20illustration%20with%20glowing%20blue%20connection%20lines%20between%20cities%2C%20network%20visualization%2C%20modern%20digital%20design%2C%20blue%20and%20teal%20color%20scheme%2C%20distribution%20points%20marked%20with%20dots%2C%20professional%20business%20graphic%2C%20clean%20minimalist%20style%2C%20technology%20network%20concept%2C%20geographic%20coverage%20map&width=1200&height=600&seq=map-dist-002&orientation=landscape"
                alt="DYAM Natural Water Distribution Network Map across Nigeria"
                title="DYAM Water Distribution Network - 500+ Points Nationwide"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </header>

        {/* Distribution Channels */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Distribution Channels
              </h2>
              <p className="text-lg text-gray-600">
                Multiple pathways to bring <strong>DYAM water</strong> to your customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <article className="text-center p-8 bg-gradient-to-br from-primary-50 to-ocean-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-ocean-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-building-line text-white text-4xl"></i>
                </div>
                <h4><a href="#contact-form" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Corporate Supply</a></h4>
                <p className="text-gray-600 mb-4 mt-3">
                  Direct supply to businesses, offices, and organizations with reliable delivery schedules
                </p>
              </article>

              <article className="text-center p-8 bg-gradient-to-br from-primary-50 to-ocean-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-ocean-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-store-line text-white text-4xl"></i>
                </div>
                <h4><a href="#contact-form" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Independent Distributors</a></h4>
                <p className="text-gray-600 mb-4 mt-3">
                  Become a distributor and build your own water distribution business with our support
                </p>
              </article>

              <article className="text-center p-8 bg-gradient-to-br from-primary-50 to-ocean-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-ocean-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-calendar-event-line text-white text-4xl"></i>
                </div>
                <h4><a href="#contact-form" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Event Partnerships</a></h4>
                <p className="text-gray-600 mb-4 mt-3">
                  Premium water solutions for weddings, conferences, sports events, and gatherings
                </p>
              </article>

              <article className="text-center p-8 bg-gradient-to-br from-primary-50 to-ocean-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-ocean-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-hospital-line text-white text-4xl"></i>
                </div>
                <h4><a href="#contact-form" className="text-xl font-semibold text-gray-900 mb-3 hover:text-brand-500 transition-colors">Institutional Contracts</a></h4>
                <p className="text-gray-600 mb-4 mt-3">
                  Long-term supply agreements for schools, hospitals, and government institutions
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-8">
                  Why Become a <strong>DYAM Distributor</strong>?
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                      <i className="ri-money-dollar-circle-line text-green-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Attractive Profit Margins</h3>
                      <p className="text-gray-600">Competitive pricing structure that ensures healthy returns on your investment</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                      <i className="ri-shield-check-line text-green-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Brand</h3>
                      <p className="text-gray-600">Partner with a NAFDAC certified brand known for quality and reliability</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                      <i className="ri-customer-service-line text-green-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Support</h3>
                      <p className="text-gray-600">Marketing materials, training, and ongoing support to help you succeed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                      <i className="ri-truck-line text-green-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Delivery</h3>
                      <p className="text-gray-600">Reliable supply chain with flexible delivery options to meet your needs</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                      <i className="ri-line-chart-line text-green-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Potential</h3>
                      <p className="text-gray-600">Expand your territory and grow your business with our expanding brand</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=successful%20Nigerian%20entrepreneur%20water%20distributor%20with%20delivery%20truck%2C%20professional%20business%20portrait%2C%20confident%20smile%2C%20modern%20logistics%20operation%2C%20water%20bottles%20in%20background%2C%20business%20success%20story%2C%20entrepreneurship%20in%20Nigeria%2C%20professional%20photography%2C%20natural%20lighting%2C%20authentic%20moment&width=800&height=1000&seq=distributor-success-001&orientation=portrait"
                  alt="Successful DYAM Water Distributor in Lagos Nigeria"
                  title="Become a DYAM Natural Water Distributor"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Become a Distributor
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and our team will contact you within 24 hours
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-ocean-50 rounded-3xl p-8 lg:p-12 shadow-xl">
              <form onSubmit={handleSubmit} data-readdy-form id="distributor-form">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Kano">Kano</option>
                      <option value="Ibadan">Ibadan</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  >
                    <option value="">Select Business Type</option>
                    <option value="Individual Distributor">Individual Distributor</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="Corporate Buyer">Corporate Buyer</option>
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Institution">Institution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your distribution plans..."
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">
                      <i className="ri-checkbox-circle-fill mr-2"></i>
                      Thank you! We&apos;ll contact you within 24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      <i className="ri-error-warning-fill mr-2"></i>
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy-600 hover:bg-navy-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>

            {/* WhatsApp Alternative */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Prefer to chat directly?</p>
              <a
                href="https://wa.me/234XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg whitespace-nowrap"
              >
                <i className="ri-whatsapp-line mr-2 text-xl"></i>
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DistributionPage;
