
import { Link } from 'react-router-dom';

const CharityHighlight = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Gradient - Red themed for charity */}
      <div className="absolute inset-0 bg-gradient-to-r from-charity-700 via-charity-600 to-charity-700"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block mb-6">
              <span className="bg-white text-charity-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                NOT FOR SALE
              </span>
            </div>
            
            <h2 className="font-serif text-5xl lg:text-6xl font-light mb-6 leading-tight">
              Water With Purpose
            </h2>
            
            <p className="text-xl leading-relaxed mb-8 text-white/90">
              DYAM Charity Water distributes free bottled water to mosques, churches, Ramadan Iftar 
              programs, orphanages, hospitals, and public gatherings. Sponsored by individuals, 
              corporates, and foundations who believe in giving back.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-sm text-white/70">Bottles Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-sm text-white/70">Communities Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-sm text-white/70">Generous Sponsors</div>
              </div>
            </div>

            <Link
              to="/charity-water"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-charity-600 px-10 py-5 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl whitespace-nowrap"
            >
              <i className="ri-heart-fill mr-3"></i>
              Sponsor Water Today
            </Link>
          </div>

          {/* Right - Photo Montage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left */}
              <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform -rotate-2">
                <img
                  src="https://readdy.ai/api/search-image?query=Nigerian%20mosque%20community%20receiving%20free%20bottled%20water%20donation%20during%20charity%20event%2C%20people%20smiling%20and%20grateful%2C%20Islamic%20architecture%20in%20background%2C%20warm%20natural%20lighting%2C%20documentary%20photography%20style%2C%20authentic%20moment%2C%20community%20support%2C%20humanitarian%20aid%2C%20cultural%20sensitivity%2C%20respectful%20composition%2C%20high%20quality%20photo&width=400&height=500&seq=charity-mosque-001&orientation=portrait"
                  alt="Charity Water at Mosque"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top Right */}
              <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-2 mt-8">
                <img
                  src="https://readdy.ai/api/search-image?query=Nigerian%20church%20congregation%20receiving%20free%20bottled%20water%20donation%2C%20happy%20faces%2C%20church%20interior%20background%2C%20natural%20lighting%2C%20documentary%20photography%20style%2C%20community%20gathering%2C%20charitable%20giving%2C%20faith-based%20support%2C%20respectful%20composition%2C%20authentic%20moment%2C%20high%20quality%20photo&width=400&height=500&seq=charity-church-001&orientation=portrait"
                  alt="Charity Water at Church"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Left */}
              <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-1">
                <img
                  src="https://readdy.ai/api/search-image?query=Nigerian%20hospital%20patients%20and%20healthcare%20workers%20receiving%20free%20bottled%20water%20donation%2C%20medical%20facility%20background%2C%20clean%20bright%20environment%2C%20documentary%20photography%20style%2C%20healthcare%20support%2C%20humanitarian%20aid%2C%20caring%20atmosphere%2C%20professional%20setting%2C%20high%20quality%20photo&width=400&height=500&seq=charity-hospital-001&orientation=portrait"
                  alt="Charity Water at Hospital"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform -rotate-1 -mt-8">
                <img
                  src="https://readdy.ai/api/search-image?query=Nigerian%20orphanage%20children%20receiving%20free%20bottled%20water%20donation%2C%20happy%20smiling%20kids%2C%20caring%20environment%2C%20natural%20lighting%2C%20documentary%20photography%20style%2C%20childhood%20joy%2C%20charitable%20support%2C%20community%20care%2C%20heartwarming%20moment%2C%20respectful%20composition%2C%20high%20quality%20photo&width=400&height=500&seq=charity-orphan-001&orientation=portrait"
                  alt="Charity Water at Orphanage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharityHighlight;
