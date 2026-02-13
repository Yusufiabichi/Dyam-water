
import { Link } from 'react-router-dom';

const DistributionPreview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-8">
              <div className="text-8xl font-light text-brand-500 mb-2">500+</div>
              <h3 className="text-3xl font-semibold text-gray-900">Distribution Points Nationwide</h3>
            </div>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our extensive distribution network ensures DYAM Natural Water reaches homes, offices, 
              events, and institutions across Nigeria. Join our growing network of distributors and 
              partners making quality water accessible to everyone.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-brand-100 rounded-lg flex-shrink-0">
                  <i className="ri-building-line text-brand-500 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Direct Corporate Supply</h4>
                  <p className="text-sm text-gray-600">Reliable water supply for businesses and organizations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-brand-100 rounded-lg flex-shrink-0">
                  <i className="ri-store-line text-brand-500 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Independent Distributors</h4>
                  <p className="text-sm text-gray-600">Empowering entrepreneurs with income opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-brand-100 rounded-lg flex-shrink-0">
                  <i className="ri-calendar-event-line text-brand-500 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Event Partnerships</h4>
                  <p className="text-sm text-gray-600">Premium water solutions for all types of events</p>
                </div>
              </div>
            </div>

            <Link
              to="/distribution-network"
              className="inline-flex items-center bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              View Network
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>

          {/* Right - Map Illustration */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px]">
              <img
                src="https://readdy.ai/api/search-image?query=abstract%20illustrated%20map%20of%20Nigeria%20with%20glowing%20blue%20dots%20representing%20distribution%20network%20points%2C%20modern%20minimalist%20design%2C%20clean%20lines%2C%20soft%20blue%20and%20teal%20color%20scheme%2C%20professional%20business%20illustration%2C%20network%20connectivity%20visualization%2C%20geographic%20coverage%20map%2C%20subtle%20animation%20effect%2C%20premium%20aesthetic%2C%20white%20background&width=800&height=800&seq=map-dist-001&orientation=squarish"
                alt="Distribution Network Map"
                className="w-full h-full object-contain"
              />
              
              {/* Animated Dots Overlay */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-brand-500 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-brand-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-brand-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributionPreview;
