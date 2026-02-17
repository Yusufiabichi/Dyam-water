
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SEOHead from '../../components/feature/SEOHead';

const ProductsPage = () => {
  const products = [
    {
      id: 1,
      size: '35cl',
      name: 'Charity & Promo Size',
      description: 'Our smallest bottle, perfect for charity distributions and promotional events. This size is exclusively used for DYAM Charity Water initiatives, bringing refreshment to communities in need.',
      features: ['NAFDAC Certified', 'Hygienically Sealed', 'BPA-Free Plastic'],
      idealFor: ['Charity Events', 'Ramadan Iftar', 'Church Programs', 'School Distributions'],
      bgColor: 'from-rose-50 to-rose-100',
      image: './charity-water.jpg',
      badge: 'NOT FOR SALE',
    },
    {
      id: 2,
      size: '50cl',
      name: 'Standard Size',
      description: 'Our most popular size, ideal for everyday hydration. Perfect for offices, homes, and on-the-go refreshment. The standard choice for quality and convenience.',
      features: ['NAFDAC Certified', 'Hygienically Sealed', 'BPA-Free Plastic'],
      idealFor: ['Office Use', 'Home Consumption', 'Travel', 'Meetings'],
      bgColor: 'from-emerald-50 to-emerald-100',
      image: './50cl.png',
    },
    {
      id: 3,
      size: '75cl',
      name: 'Large Size',
      description: 'Extra hydration for those who need more. Perfect for sports, outdoor activities, and extended periods away from refill stations. Stay refreshed longer.',
      features: ['NAFDAC Certified', 'Hygienically Sealed', 'BPA-Free Plastic'],
      idealFor: ['Sports & Fitness', 'Outdoor Activities', 'Long Meetings', 'Extended Travel'],
      bgColor: 'from-violet-50 to-violet-100',
      image: './75cl.jpg',
    },
    {
      id: 4,
      size: '15L',
      name: 'Dispenser Bottle',
      description: 'Our largest offering for offices, homes, and events. Compatible with standard water dispensers, providing convenient access to fresh, clean water for groups and families.',
      features: ['NAFDAC Certified', 'Hygienically Sealed', 'Food-Grade Plastic'],
      idealFor: ['Office Dispensers', 'Home Use', 'Events', 'Institutions'],
      bgColor: 'from-amber-50 to-amber-100',
      image: './dispenser.jpg',
    },
  ];

  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "DYAM Natural Water Products",
    "description": "Browse NAFDAC certified premium bottled water products from DYAM Natural Water. Available in 35cl, 50cl, 75cl, and 15L sizes for homes, offices, and events in Lagos Nigeria.",
    "url": "https://dyamwater.com/products",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": `DYAM Natural Water ${product.size} - ${product.name}`,
          "description": product.description,
          "brand": { "@type": "Brand", "name": "DYAM Natural Water" },
          "category": "Bottled Water",
          "image": product.image
        }
      }))
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="DYAM Water Products | NAFDAC Certified Bottled Water Lagos Nigeria"
        description="Browse NAFDAC certified premium bottled water from DYAM Natural Water. Available in 35cl, 50cl, 75cl, and 15L sizes. Safe drinking water for homes, offices, and events across Lagos Nigeria."
        keywords="DYAM water products, NAFDAC certified bottled water, premium water Lagos, water dispenser bottle Nigeria"
        canonicalPath="/products"
        structuredData={productsStructuredData}
      />
      <Navbar />
      <main>
        {/* Header Section */}
        <header className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-ocean-50 to-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <li><a href="/" className="hover:text-brand-500 transition-colors">Home</a></li>
                <li>/</li>
                <li className="text-gray-700">Products</li>
              </ol>
            </nav>
            <h1 className="font-serif text-5xl lg:text-6xl text-gray-900 mb-6">
              Premium <strong>Hydration</strong> Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every bottle of <strong>DYAM Natural Water</strong> is NAFDAC certified, hygienically processed, 
              and sealed for your safety. Choose the perfect size for your hydration needs.
            </p>
          </div>
        </header>

        {/* Products Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16" data-product-shop>
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className={`relative rounded-3xl bg-gradient-to-br ${product.bgColor} shadow-xl overflow-hidden`}>
                      <div className="w-full h-96">
                        <img
                          src={product.image}
                          alt={`DYAM ${product.size} ${product.name} - NAFDAC Certified Bottled Water Nigeria`}
                          title={`DYAM Natural Water ${product.size} ${product.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {product.badge && (
                        <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                          {product.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="inline-block mb-4">
                      <span className="text-sm font-medium text-ocean-600 tracking-wider uppercase">
                        / {product.size}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h2>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Features
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {product.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full"
                          >
                            <i className="ri-checkbox-circle-fill text-green-600"></i>
                            <span className="text-sm font-medium text-green-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ideal For */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Ideal For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.idealFor.map((use, idx) => (
                          <span
                            key={idx}
                            className="bg-ocean-50 text-ocean-700 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    {product.badge !== 'NOT FOR SALE' && (
                      <a
                        href="/contact"
                        className="inline-flex items-center bg-navy-600 hover:bg-navy-700 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        Request Quote
                        <i className="ri-arrow-right-line ml-2"></i>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 bg-gradient-to-r from-navy-800 to-ocean-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
              Need Bulk Orders?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Contact us for special pricing on bulk orders and distribution opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-navy-700 px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg whitespace-nowrap"
              >
                <i className="ri-mail-line mr-2"></i>
                Get Quote
              </a>
              <a
                href="https://wa.me/234XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-lg whitespace-nowrap"
              >
                <i className="ri-whatsapp-line mr-2"></i>
                WhatsApp Us
              </a>
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 cursor-pointer"
        aria-label="Chat on WhatsApp for DYAM Water orders"
      >
        <i className="ri-whatsapp-line text-3xl"></i>
      </a>
    </div>
  );
};

export default ProductsPage;
