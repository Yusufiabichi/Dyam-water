
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';
import { useState } from 'react';

const CharityPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    distributeTo: '',
    plan: '',
    amount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const individualPlans = [
    {
      id: 'sadaqah',
      name: 'Sadaqah Pack',
      cartons: 1,
      bottles: 20,
      amount: 2500,
      description: 'Ideal for one family or small mosque section',
      icon: 'ri-heart-line',
    },
    {
      id: 'jumuah',
      name: "Jumu'ah Pack",
      cartons: 5,
      bottles: 100,
      amount: 12500,
      description: 'Suitable for Friday mosque distribution',
      icon: 'ri-community-line',
    },
    {
      id: 'community',
      name: 'Community Pack',
      cartons: 10,
      bottles: 200,
      amount: 25000,
      description: 'Supports a larger gathering or community outreach',
      icon: 'ri-group-line',
    },
  ];

  const ramadanPlans = [
    {
      id: 'daily-iftar',
      name: 'Daily Iftar Pack',
      cartons: 20,
      bottles: 400,
      amount: 50000,
      description: 'Provides water for one Iftar gathering',
      icon: 'ri-moon-line',
    },
    {
      id: 'one-week',
      name: 'One Week Sponsor',
      cartons: 50,
      bottles: 1000,
      amount: 125000,
      description: 'Covers one week of Ramadan distribution',
      icon: 'ri-calendar-line',
    },
    {
      id: 'full-ramadan',
      name: 'Full Ramadan Sponsor',
      cartons: 200,
      bottles: 4000,
      amount: 500000,
      description: 'Full Ramadan impact support',
      icon: 'ri-star-fill',
      featured: true,
    },
  ];

  const corporatePlans = [
    {
      id: 'gold-partner',
      name: 'Gold Partner',
      cartons: 500,
      bottles: 10000,
      amount: 1250000,
      description: 'Large-scale community impact',
      badge: 'Corporate Recognition Option',
      icon: 'ri-medal-line',
    },
    {
      id: 'platinum-partner',
      name: 'Platinum Partner',
      cartons: 1000,
      bottles: 20000,
      amount: 2500000,
      description: 'Major sponsorship & large outreach programs',
      badge: 'Premium Recognition & Visibility',
      icon: 'ri-trophy-line',
      featured: true,
    },
  ];

  const handlePlanSelect = (planId: string, planName: string, amount: number) => {
    setSelectedPlan(planId);
    setFormData(prev => ({ ...prev, plan: planName, amount: amount.toString() }));
    setShowDonationForm(true);
    setTimeout(() => {
      document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // normalize frontend keys to backend expected keys
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        distributed_to: formData.distributeTo,
        selected_plan: formData.plan,
        amount: Number(formData.amount) || 0,
      };

      const response = await fetch('http://localhost:4000/api/sponsors/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          distributeTo: '',
          plan: '',
          amount: '',
        });
        setSelectedPlan('');
        setShowDonationForm(false);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const charityStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DYAM Charity Water - Free Water Distribution Nigeria",
    "description": "Sponsor free bottled water distribution to mosques, churches, hospitals, orphanages, and Ramadan Iftar programs across Nigeria. DYAM Charity Water is NOT FOR SALE.",
    "url": "https://dyamwater.com/charity-water",
    "mainEntity": {
      "@type": "NGO",
      "name": "DYAM Charity Water",
      "description": "Free bottled water distribution to communities in need across Nigeria",
      "areaServed": { "@type": "Country", "name": "Nigeria" }
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is DYAM Charity Water?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DYAM Charity Water is a special line of NOT FOR SALE bottled water distributed free to communities in need. Every bottle is a gift of refreshment and care, made possible by generous sponsors."
        }
      },
      {
        "@type": "Question",
        "name": "Who sponsors DYAM Charity Water?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our charity water program is made possible by compassionate individuals, forward-thinking corporates, and dedicated foundations who believe in using business as a force for good."
        }
      },
      {
        "@type": "Question",
        "name": "Where is DYAM Charity Water distributed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DYAM Charity Water is distributed to mosques, churches, hospitals, orphanages, Ramadan Iftar programs, and public events across Nigeria."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Charity Water Donation Nigeria | Sponsor Free Water | DYAM"
        description="Sponsor free bottled water distribution to mosques, churches, hospitals, orphanages, and Ramadan Iftar programs across Nigeria. DYAM Charity Water - NOT FOR SALE. 10,000+ bottles distributed."
        keywords="charity water Nigeria, donate water Lagos, free water distribution, sponsor water mosques churches, Ramadan water donation"
        canonicalPath="/charity-water"
        structuredData={charityStructuredData}
      />
      <Navbar />
      <main>
        {/* Emotional Hero Section */}
        <header className="relative min-h-screen flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://readdy.ai/api/search-image?query=hands%20receiving%20bottled%20water%20with%20gratitude%2C%20soft%20focus%20background%20of%20Nigerian%20community%20gathering%2C%20warm%20natural%20lighting%2C%20emotional%20moment%2C%20humanitarian%20aid%2C%20charitable%20giving%2C%20people%20helping%20people%2C%20hope%20and%20compassion%2C%20documentary%20photography%20style%2C%20authentic%20moment%2C%20cultural%20sensitivity%2C%20heartwarming%20scene&width=1920&height=1080&seq=charity-hero-001&orientation=landscape"
              alt="DYAM Charity Water distribution to Nigerian communities - free bottled water donation"
              title="DYAM Charity Water Impact - Free Water for Communities"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charity-900/80 via-charity-800/40 to-black/20"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
            <div className="max-w-3xl">
              <div className="inline-block mb-6">
                <span className="bg-white text-charity-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                  NOT FOR SALE
                </span>
              </div>
              
              <h1 className="font-serif text-6xl lg:text-7xl text-white mb-6 leading-tight">
                <strong>Water That Gives Back</strong>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/95 mb-10 leading-relaxed">
                DYAM <strong>Charity Water</strong> distributes free bottled water to mosques, churches, Ramadan Iftar 
                programs, orphanages, hospitals, and public gatherings. Sponsored by individuals, 
                corporates, and foundations who believe in giving back.
              </p>

              <a
                href="#charity-plans"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-charity-600 px-10 py-5 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl whitespace-nowrap"
              >
                <i className="ri-heart-fill mr-3"></i>
                Sponsor Now
              </a>
            </div>
          </div>
        </header>

        {/* What Is DYAM Charity Water */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-8">
              <i className="ri-heart-fill text-charity-500 text-5xl"></i>
            </div>
            
            <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-8">
              What Is DYAM <strong>Charity Water</strong>?
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              DYAM Charity Water is a special line of <strong className="text-charity-600">NOT FOR SALE</strong> bottled water distributed 
              free to communities in need. Every bottle is a gift of refreshment and care, made possible by 
              generous sponsors who understand the power of giving.
            </p>

            {/* Pricing Info */}
            <div className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-3xl p-8 mb-12">
              <div className="text-center">
                <p className="text-lg text-charity-700 font-medium mb-2">Pure Charity Sponsorship Plans</p>
                <p className="text-gray-600 mb-4">35cl × 20 Bottles Per Carton</p>
                <div className="text-4xl font-bold text-charity-600 mb-2">₦2,500 <span className="text-lg font-normal text-gray-600">Per Carton</span></div>
                <div className="inline-block bg-charity-500 text-white text-sm font-bold px-4 py-2 rounded-full mt-4">
                  STATUS: NOT FOR SALE
                </div>
                <p className="text-sm text-gray-600 mt-4">Every naira donated goes directly into water production and distribution.</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-2xl p-8">
                <div className="text-5xl font-bold text-charity-600 mb-2">10,000+</div>
                <div className="text-gray-700 font-medium">Bottles Distributed</div>
              </div>
              <div className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-2xl p-8">
                <div className="text-5xl font-bold text-charity-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">Communities Reached</div>
              </div>
              <div className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-2xl p-8">
                <div className="text-5xl font-bold text-charity-600 mb-2">100+</div>
                <div className="text-gray-700 font-medium">Generous Sponsors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-24 bg-gradient-to-b from-charity-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Who We Serve
              </h2>
              <p className="text-lg text-gray-600">
                Bringing refreshment to communities across Nigeria
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-brand-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-community-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mosques</h3>
                <p className="text-gray-600">
                  Supporting Islamic communities during prayers, Ramadan, and special gatherings
                </p>
              </article>

              <article className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-teal-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-home-heart-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Churches</h3>
                <p className="text-gray-600">
                  Refreshing Christian congregations during services and community events
                </p>
              </article>

              <article className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-hospital-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hospitals</h3>
                <p className="text-gray-600">
                  Providing clean water to patients, visitors, and healthcare workers
                </p>
              </article>

              <article className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-charity-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-heart-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Orphanages</h3>
                <p className="text-gray-600">
                  Caring for vulnerable children with safe, clean drinking water
                </p>
              </article>

              <article className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-amber-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-restaurant-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ramadan Programs</h3>
                <p className="text-gray-600">
                  Supporting Iftar meals and breaking of fast during the holy month
                </p>
              </article>

              <article className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-cyan-500 rounded-2xl flex items-center justify-center">
                  <i className="ri-group-line text-white text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Public Events</h3>
                <p className="text-gray-600">
                  Refreshing communities at public gatherings and celebrations
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Who Sponsors */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-8">
              Who Sponsors DYAM <strong>Charity Water</strong>?
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              Our charity water program is made possible by compassionate individuals, forward-thinking 
              corporates, and dedicated foundations who believe in using business as a force for good.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-500 rounded-full flex items-center justify-center">
                  <i className="ri-user-heart-line text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Individuals</h3>
                <p className="text-gray-600">
                  Personal sponsors making a difference in their communities
                </p>
              </article>

              <article className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-500 rounded-full flex items-center justify-center">
                  <i className="ri-building-line text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Corporates</h3>
                <p className="text-gray-600">
                  Companies fulfilling their social responsibility commitments
                </p>
              </article>

              <article className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-500 rounded-full flex items-center justify-center">
                  <i className="ri-hand-heart-line text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Foundations</h3>
                <p className="text-gray-600">
                  Charitable organizations supporting community welfare
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Charity Plans */}
        <section id="charity-plans" className="py-24 bg-gradient-to-b from-charity-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Sponsorship Plans
              </h2>
              <p className="text-lg text-gray-600">
                Choose a plan that matches your giving capacity
              </p>
            </div>

            {/* Individual & Family Packages */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-heart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Individual &amp; Family Packages</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {individualPlans.map((plan, index) => (
                  <article
                    key={plan.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-md font-bold">{index + 1}️</span>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <i className={`${plan.icon} text-white text-xl`}></i>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold">{plan.name}</h4>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-gray-600 text-sm mb-1">{plan.cartons} Carton{plan.cartons > 1 ? 's' : ''} ({plan.bottles} Bottles)</p>
                        <p className="text-gray-500 text-sm flex items-center justify-center">
                          <i className="ri-drop-line text-brand-500 mr-1"></i>
                          {plan.description}
                        </p>
                      </div>
                      
                      <div className="text-center mb-6">
                        <span className="text-3xl font-bold text-gray-900">₦{plan.amount.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => handlePlanSelect(plan.id, plan.name, plan.amount)}
                        className={`w-full py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          selectedPlan === plan.id
                            ? 'bg-green-500 text-white'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Sponsor This Pack'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Ramadan Impact Packages */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-moon-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Ramadan Impact Packages</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {ramadanPlans.map((plan, index) => (
                  <article
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                      plan.featured ? 'ring-4 ring-amber-400 transform lg:-translate-y-2' : 'border border-gray-100'
                    }`}
                  >
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 relative">
                      {plan.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-white text-amber-600 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <i className="ri-star-fill mr-1"></i> Most Impactful
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-md font-bold">{index + 4}️</span>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <i className={`${plan.icon} text-white text-xl`}></i>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold">{plan.name}</h4>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-gray-600 text-sm mb-1">{plan.cartons} Cartons ({plan.bottles.toLocaleString()} Bottles)</p>
                        <p className="text-gray-500 text-sm flex items-center justify-center">
                          <i className="ri-drop-line text-brand-500 mr-1"></i>
                          {plan.description}
                        </p>
                      </div>
                      
                      <div className="text-center mb-6">
                        <span className="text-3xl font-bold text-gray-900">₦{plan.amount.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => handlePlanSelect(plan.id, plan.name, plan.amount)}
                        className={`w-full py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          selectedPlan === plan.id
                            ? 'bg-amber-500 text-white'
                            : plan.featured
                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Sponsor This Pack'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Corporate & Philanthropist Packages */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-charity-500 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-building-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Corporate &amp; Philanthropist Packages</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {corporatePlans.map((plan, index) => (
                  <article
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                      plan.featured ? 'ring-4 ring-charity-400 transform lg:-translate-y-2' : 'border border-gray-100'
                    }`}
                  >
                    <div className="bg-gradient-to-r from-charity-600 to-charity-700 text-white p-6 relative">
                      {plan.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-white text-charity-600 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <i className="ri-trophy-fill mr-1"></i> Premium
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-md font-bold">{index + 7}️</span>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <i className={`${plan.icon} text-white text-xl`}></i>
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold">{plan.name}</h4>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-gray-600 text-sm mb-1">{plan.cartons.toLocaleString()} Cartons ({plan.bottles.toLocaleString()} Bottles)</p>
                        <p className="text-gray-500 text-sm flex items-center justify-center">
                          <i className="ri-drop-line text-brand-500 mr-1"></i>
                          {plan.description}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center bg-charity-50 text-charity-600 text-xs font-medium px-3 py-1 rounded-full">
                            <i className={`${plan.featured ? 'ri-trophy-line' : 'ri-medal-line'} mr-1`}></i>
                            {plan.badge}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <span className="text-3xl font-bold text-gray-900">₦{plan.amount.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => handlePlanSelect(plan.id, plan.name, plan.amount)}
                        className={`w-full py-4 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          selectedPlan === plan.id
                            ? 'bg-charity-500 text-white'
                            : 'bg-charity-500 text-white hover:bg-charity-600'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Selected' : `Become a ${plan.name}`}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedPlan ? 'bg-green-500 text-white' : 'bg-charity-500 text-white'
                  }`}>
                    {selectedPlan ? <i className="ri-check-line"></i> : '1'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Choose Plan</span>
                </div>
                
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                  <div className={`h-full bg-charity-500 transition-all ${showDonationForm ? 'w-full' : 'w-0'}`}></div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    showDonationForm ? 'bg-charity-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-700">Your Details</span>
                </div>
                
                <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-700">Payment</span>
                </div>
                
                <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    4
                  </div>
                  <span className="text-sm font-medium text-gray-700">Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        {showDonationForm && (
          <section id="donation-form" className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl text-gray-900 mb-4">
                  Complete Your Sponsorship
                </h2>
                <p className="text-lg text-gray-600">
                  You&apos;ve selected the <strong className="text-charity-600">{formData.plan}</strong> plan
                </p>
              </div>

              <div className="bg-gradient-to-br from-charity-50 to-charity-100 rounded-3xl p-8 lg:p-12 shadow-xl">
                <form onSubmit={handleSubmit} data-readdy-form id="charity-donation-form">
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-charity-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="charity-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="charity-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-charity-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="charity-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="charity-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-charity-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="distributeTo" className="block text-sm font-medium text-gray-700 mb-2">
                      Distribute To *
                    </label>
                    <select
                      id="distributeTo"
                      name="distributeTo"
                      value={formData.distributeTo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-charity-500 focus:border-transparent bg-white cursor-pointer"
                    >
                      <option value="">Select distribution location</option>
                      <option value="Mosques">Mosques</option>
                      <option value="Orphanages">Orphanages</option>
                      <option value="Hospitals">Hospitals</option>
                      <option value="Churches">Churches</option>
                      <option value="Ramadan Iftar Programs">Ramadan Iftar Programs</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <input type="hidden" name="plan" value={formData.plan} />
                  <input type="hidden" name="amount" value={formData.amount} />

                  <div className="bg-white rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Selected Plan:</span>
                      <span className="font-semibold text-gray-900">{formData.plan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Amount:</span>
                      <span className="text-2xl font-bold text-charity-600">₦{parseInt(formData.amount).toLocaleString()}</span>
                    </div>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Thank you for your generous sponsorship! continue to make your payment securely.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">
                        <i className="ri-error-warning-fill mr-2"></i>
                        Something went wrong. Please try again.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-charity-500 hover:bg-charity-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                  </button>

                  <p className="text-sm text-gray-600 text-center mt-4">
                    When payment is confirmed, you will receive an email confirmation after submission.
                  </p>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* Impact Stories / FAQ */}
        <section className="py-24 bg-gradient-to-b from-brand-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4">
                Impact Stories
              </h2>
              <p className="text-lg text-gray-600">
                Hear from communities we&apos;ve served
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400"></i>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  &ldquo;DYAM Charity Water blessed our Ramadan Iftar program. The water arrived on time and 
                  brought smiles to hundreds of faces. May Allah reward the sponsors.&rdquo;
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-brand-500 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Imam Abdullah</div>
                    <div className="text-sm text-gray-600">Central Mosque, Lagos</div>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400"></i>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  &ldquo;Our church members were so grateful for the clean water during our outreach program. 
                  DYAM&apos;s charity initiative is truly making a difference.&rdquo;
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-brand-500 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pastor Grace</div>
                    <div className="text-sm text-gray-600">Faith Chapel, Abuja</div>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400"></i>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  &ldquo;The children at our orphanage were so happy to receive clean water. Thank you DYAM 
                  and all the sponsors for remembering us.&rdquo;
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-brand-500 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mrs. Adeyemi</div>
                    <div className="text-sm text-gray-600">Hope Orphanage, Ibadan</div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-charity-700 to-charity-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
              Every Drop Makes a Difference
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join us in bringing refreshment and hope to communities across Nigeria
            </p>
            <a
              href="#charity-plans"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-charity-600 px-10 py-5 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl whitespace-nowrap"
            >
              <i className="ri-heart-fill mr-3"></i>
              Become a Sponsor Today
            </a>
          </div>
        </section>
      </main>

      {/* FAQ Structured Data Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <Footer />
    </div>
  );
};

export default CharityPage;
