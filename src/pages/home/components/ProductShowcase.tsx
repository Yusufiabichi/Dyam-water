
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      size: '35cl',
      name: 'Charity & Promo',
      badge: 'NOT FOR SALE',
      bgColor: 'from-charity-50 to-charity-100',
      image: 'https://readdy.ai/api/search-image?query=premium%2035cl%20small%20bottled%20water%20bottle%20product%20photography%20on%20soft%20coral%20pink%20gradient%20background%2C%20minimalist%20clean%20aesthetic%2C%20centered%20composition%2C%20professional%20studio%20lighting%2C%20high%20quality%20commercial%20photo%2C%20water%20droplets%20on%20bottle%20surface%2C%20NAFDAC%20certified%20label%20visible%2C%20Nigerian%20bottled%20water%20brand%2C%20simple%20elegant%20design%2C%20sharp%20focus&width=400&height=600&seq=prod-35cl-001&orientation=portrait',
    },
    {
      id: 2,
      size: '50cl',
      name: 'Standard Size',
      badge: 'NAFDAC Certified',
      bgColor: 'from-brand-50 to-brand-100',
      image: 'https://readdy.ai/api/search-image?query=premium%2050cl%20medium%20bottled%20water%20bottle%20product%20photography%20on%20soft%20mint%20green%20gradient%20background%2C%20minimalist%20clean%20aesthetic%2C%20centered%20composition%2C%20professional%20studio%20lighting%2C%20high%20quality%20commercial%20photo%2C%20water%20droplets%20on%20bottle%20surface%2C%20NAFDAC%20certified%20label%20visible%2C%20Nigerian%20bottled%20water%20brand%2C%20simple%20elegant%20design%2C%20sharp%20focus&width=400&height=600&seq=prod-50cl-001&orientation=portrait',
    },
    {
      id: 3,
      size: '75cl',
      name: 'Large Size',
      badge: 'NAFDAC Certified',
      bgColor: 'from-teal-50 to-teal-100',
      image: 'https://readdy.ai/api/search-image?query=premium%2075cl%20large%20bottled%20water%20bottle%20product%20photography%20on%20soft%20pale%20lavender%20gradient%20background%2C%20minimalist%20clean%20aesthetic%2C%20centered%20composition%2C%20professional%20studio%20lighting%2C%20high%20quality%20commercial%20photo%2C%20water%20droplets%20on%20bottle%20surface%2C%20NAFDAC%20certified%20label%20visible%2C%20Nigerian%20bottled%20water%20brand%2C%20simple%20elegant%20design%2C%20sharp%20focus&width=400&height=600&seq=prod-75cl-001&orientation=portrait',
    },
    {
      id: 4,
      size: '15L',
      name: 'Dispenser',
      badge: 'NAFDAC Certified',
      bgColor: 'from-amber-50 to-amber-100',
      image: 'https://readdy.ai/api/search-image?query=premium%2015%20liter%20water%20dispenser%20bottle%20product%20photography%20on%20warm%20sand%20beige%20gradient%20background%2C%20minimalist%20clean%20aesthetic%2C%20centered%20composition%2C%20professional%20studio%20lighting%2C%20high%20quality%20commercial%20photo%2C%20large%20water%20container%2C%20NAFDAC%20certified%20label%20visible%2C%20Nigerian%20bottled%20water%20brand%2C%20simple%20elegant%20design%2C%20sharp%20focus&width=400&height=600&seq=prod-15l-001&orientation=portrait',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-serif text-5xl lg:text-6xl text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            NAFDAC compliant, hygienically processed, and sealed for your safety
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-product-shop>
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Area */}
              <div className={`relative h-80 bg-gradient-to-br ${product.bgColor} p-8 flex items-center justify-center`}>
                <div className="w-full h-full">
                  <img
                    src={product.image}
                    alt={`DYAM ${product.size} Water Bottle`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {product.badge === 'NOT FOR SALE' && (
                  <div className="absolute top-4 right-4 bg-charity-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.size}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.name}</p>
                {product.badge === 'NAFDAC Certified' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full">
                      <i className="ri-checkbox-circle-fill text-green-600 text-sm"></i>
                    </div>
                    <span className="text-xs font-medium text-green-700">{product.badge}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            View All Products
            <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
