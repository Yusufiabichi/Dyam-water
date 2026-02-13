
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=crystal%20clear%20water%20droplet%20suspended%20in%20mid-air%20with%20splash%20effect%20against%20soft%20focus%20Nigerian%20tropical%20landscape%20background%2C%20pristine%20blue%20sky%2C%20lush%20green%20vegetation%2C%20professional%20photography%2C%20ultra%20high%20quality%2C%20cinematic%20lighting%2C%20shallow%20depth%20of%20field%2C%20water%20purity%20concept%2C%20refreshing%20atmosphere%2C%20natural%20beauty%2C%20premium%20aesthetic%2C%20film%20grain%20texture&width=1920&height=1080&seq=hero-bg-001&orientation=landscape"
          alt="Pure Water Background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-white/80 tracking-wider">
                / PREMIUM NIGERIAN WATER
              </span>
            </div>
            
            <h1 className="font-serif text-6xl lg:text-7xl font-light mb-6 leading-tight">
              DYAM Natural Water
            </h1>
            
            <p className="font-serif text-3xl italic font-light mb-8 text-white/90">
              Pure. Refreshing. Purpose-Driven.
            </p>
            
            <p className="text-lg leading-relaxed mb-12 text-white/90 max-w-xl">
              Premium bottled water for everyday refreshment and impactful giving. Experience quality hydration while making a difference in communities across Nigeria.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/distribution-network"
                className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <i className="ri-truck-line mr-2"></i>
                Become a Distributor
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-brand-500 text-white px-8 py-4 rounded-full text-base font-medium transition-all whitespace-nowrap"
              >
                <i className="ri-handshake-line mr-2"></i>
                Partner With Us
              </Link>
              <Link
                to="/charity-water"
                className="inline-flex items-center justify-center bg-charity-500 hover:bg-charity-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <i className="ri-heart-fill mr-2"></i>
                Donate Water
              </Link>
            </div>
          </div>

          {/* Right side - empty for image background */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <i className="ri-arrow-down-line text-white/70 text-2xl"></i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
