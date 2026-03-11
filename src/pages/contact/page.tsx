import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';
import { useState } from 'react';
import { apiUrl } from '../../lib/api';

const ContactPage = () => {
  const [activeTab, setActiveTab] = useState<'distributor' | 'corporate' | 'institution' | 'charity'>('distributor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partnershipType: 'Distributor',
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
      const payload = {
        full_name: formData.name,
        email_address: formData.email,
        phone: formData.phone,
        partnership_type: formData.partnershipType,
        message: formData.message,
      };

      const response = await fetch(apiUrl('messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          partnershipType: 'Distributor',
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

  const partnershipContent = {
    distributor: {
      title: 'Become a Distributor',
      benefits: [
        'Attractive profit margins on all products',
        'Exclusive territory rights in your area',
        'Marketing and promotional support',
        'Flexible payment terms',
        'Regular training and business development',
      ],
      requirements: [
        'Valid business registration or intent to register',
        'Storage facility for inventory',
        'Distribution capability (vehicle/logistics)',
        'Commitment to quality service',
      ],
      process: [
        'Submit your application through the form',
        'Initial consultation and territory assessment',
        'Agreement signing and onboarding',
        'Training and first order placement',
        'Launch and ongoing support',
      ],
    },
    corporate: {
      title: 'Corporate Partnership',
      benefits: [
        'Bulk pricing for regular orders',
        'Scheduled delivery to your premises',
        'Dedicated account manager',
        'Customized invoicing and payment terms',
        'Priority customer support',
      ],
      requirements: [
        'Registered business entity',
        'Minimum monthly order commitment',
        'Designated receiving location',
        'Purchase order system (preferred)',
      ],
      process: [
        'Contact us with your requirements',
        'Receive customized quote and terms',
        'Agreement finalization',
        'Setup delivery schedule',
        'Ongoing service and support',
      ],
    },
    institution: {
      title: 'Institutional Supply',
      benefits: [
        'Special pricing for educational and healthcare institutions',
        'Flexible contract terms',
        'Reliable supply chain',
        'Quality assurance and compliance',
        'Emergency supply support',
      ],
      requirements: [
        'Valid institutional registration',
        'Procurement authorization',
        'Delivery access and schedule',
        'Payment terms agreement',
      ],
      process: [
        'Submit institutional inquiry',
        'Site visit and needs assessment',
        'Proposal and contract preparation',
        'Approval and agreement signing',
        'Implementation and regular supply',
      ],
    },
    charity: {
      title: 'Charity Sponsorship',
      benefits: [
        'Make a meaningful impact in communities',
        'Tax-deductible charitable contribution',
        'Impact reports and documentation',
        'Recognition and visibility',
        'Site visit opportunities',
      ],
      requirements: [
        'Commitment to sponsorship plan',
        'Contact information for communication',
        'Payment method setup',
        'Agreement to terms and conditions',
      ],
      process: [
        'Select your sponsorship plan',
        'Complete sponsor registration',
        'Make secure payment',
        'Receive confirmation and certificate',
        'Get regular impact updates',
      ],
    },
  };

  const content = partnershipContent[activeTab];

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact DYAM Natural Water",
    "description": "Contact DYAM Natural Water for distribution partnerships, corporate supply, institutional contracts, and charity sponsorship in Lagos Nigeria.",
    "url": "https://dyamwater.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "DYAM Natural Water",
      "email": "info@dyamwater.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressCountry": "NG"
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact DYAM Natural Water | Partnership Inquiry Lagos Nigeria"
        description="Contact DYAM Natural Water for distribution partnerships, corporate water supply, institutional contracts, and charity sponsorship. Located in Lagos, Nigeria. We respond within 24 hours."
        keywords="contact DYAM water, water distributor partnership Lagos, corporate water supply Nigeria, charity water sponsorship"
        canonicalPath="/contact"
        structuredData={contactStructuredData}
      />
      <Navbar />
      <main>
        {/* Split Hero Layout */}
        <section className="pt-32 pb-0 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Contact Info */}
              <div className="bg-gradient-to-br from-navy-800 to-ocean-700 text-white p-12 lg:p-16 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                <h1 className="font-serif text-4xl lg:text-5xl mb-8">Let&apos;s <strong>Connect</strong></h1>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg flex-shrink-0">
                      <i className="ri-phone-line text-ocean-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-white/70 mb-1">Phone</div>
                      <div className="text-lg">+234 701 439 6344</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg flex-shrink-0">
                      <i className="ri-mail-line text-ocean-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-white/70 mb-1">Email</div>
                      <div className="text-lg">info@dyamwater.com</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg flex-shrink-0">
                      <i className="ri-map-pin-line text-ocean-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-white/70 mb-1">Address</div>
                      <div className="text-lg">Kitwe street, Wuse, Abuja, Nigeria</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-white/70 mb-4">Follow Us</div>
                  <div className="flex space-x-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      aria-label="Follow DYAM Water on Facebook"
                    >
                      <i className="ri-facebook-fill text-xl"></i>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      aria-label="Follow DYAM Water on Instagram"
                    >
                      <i className="ri-instagram-line text-xl"></i>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      aria-label="Follow DYAM Water on Twitter"
                    >
                      <i className="ri-twitter-x-line text-xl"></i>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      aria-label="Follow DYAM Water on LinkedIn"
                    >
                      <i className="ri-linkedin-fill text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="bg-gradient-to-br from-primary-50 to-ocean-50 p-12 lg:p-16 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">We respond within 24 hours</p>

                <form onSubmit={handleSubmit} data-readdy-form id="contact-form">
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700 mb-2">
                      Partnership Type *
                    </label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    >
                      <option value="Distributor">Distributor</option>
                      <option value="Corporate Partner">Corporate Partner</option>
                      <option value="Institution">Institution</option>
                      <option value="Charity Sponsor">Charity Sponsor</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        <i className="ri-error-warning-fill mr-2"></i>
                        Failed to send message. Please try again.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy-600 hover:bg-navy-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Categories */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-lg text-gray-600">
                Explore different ways to work with <strong>DYAM Natural Water</strong>
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveTab('distributor')}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTab === 'distributor'
                    ? 'bg-ocean-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Distributor
              </button>
              <button
                onClick={() => setActiveTab('corporate')}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTab === 'corporate'
                    ? 'bg-ocean-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Corporate Partner
              </button>
              <button
                onClick={() => setActiveTab('institution')}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTab === 'institution'
                    ? 'bg-ocean-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Institution
              </button>
              <button
                onClick={() => setActiveTab('charity')}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTab === 'charity'
                    ? 'bg-ocean-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Charity Sponsor
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-primary-50 to-ocean-50 rounded-3xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">{content.title}</h3>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Benefits */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                  <ul className="space-y-3">
                    {content.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <i className="ri-checkbox-circle-fill text-green-500 mt-1 flex-shrink-0"></i>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h4>
                  <ul className="space-y-3">
                    {content.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <i className="ri-file-list-line text-ocean-500 mt-1 flex-shrink-0"></i>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Process</h4>
                  <ol className="space-y-3">
                    {content.process.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center bg-ocean-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="#contact-form"
                  className="inline-flex items-center bg-navy-600 hover:bg-navy-700 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Get Started
                  <i className="ri-arrow-right-line ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-gray-900 mb-4">Visit Our Office</h2>
              <p className="text-lg text-gray-600">Lagos, Nigeria</p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps?q=Kitwe+Street,+Wuse,+Abuja,+Nigeria&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DYAM Natural Water Office Location - Kitwe Street, Wuse, Abuja Nigeria"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/234XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 cursor-pointer group"
        aria-label="Chat with DYAM Water on WhatsApp"
      >
        <i className="ri-whatsapp-line text-3xl"></i>
        <span className="absolute right-20 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with us
        </span>
      </a>
    </div>
  );
};

export default ContactPage;
