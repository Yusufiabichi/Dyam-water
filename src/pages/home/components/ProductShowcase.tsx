
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      size: '35cl',
      name: 'Charity & Promo',
      badge: 'NOT FOR SALE',
      bgColor: 'from-charity-50 to-charity-100',
      image: './charity-water.jpg',
    },
    {
      id: 2,
      size: '50cl',
      name: 'Standard Size',
      badge: 'NAFDAC Certified',
      bgColor: 'from-brand-50 to-brand-100',
      image: './50cl.png',
    },
    {
      id: 3,
      size: '75cl',
      name: 'Large Size',
      badge: 'NAFDAC Certified',
      bgColor: 'from-teal-50 to-teal-100',
      image: './75cl.jpg',
    },
    {
      id: 4,
      size: '15L',
      name: 'Dispenser',
      badge: 'NAFDAC Certified',
      bgColor: 'from-amber-50 to-amber-100',
      image: './dispenser.jpg',
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
              <div className={`relative h-80 bg-gradient-to-br ${product.bgColor} overflow-hidden`}>
                <div className="w-full h-full">
                  <img
                    src={product.image}
                    alt={`DYAM ${product.size} Water Bottle`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
