
import { Link } from 'react-router-dom';

const AboutPreview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-brand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="text-sm font-medium text-brand-500 tracking-wider uppercase">
            / Who We Are
          </span>
        </div>
        
        <h2 className="font-serif text-5xl lg:text-6xl mb-8 leading-tight">
          <span className="font-normal text-gray-900">Premium bottled water</span>
          <br />
          <span className="font-light italic text-gray-700">for everyday refreshment</span>
          <br />
          <span className="font-semibold text-brand-500">and impactful giving</span>
        </h2>
        
        <p className="text-xl leading-relaxed text-gray-600 mb-12 max-w-3xl mx-auto">
          DYAM Natural Water is a Nigerian-owned bottled water brand committed to delivering safe, 
          affordable drinking water while creating income opportunities through distribution and 
          supporting communities with free water through our charity initiative.
        </p>

        <Link
          to="/about-us"
          className="inline-flex items-center text-brand-500 hover:text-brand-600 font-medium transition-colors group whitespace-nowrap"
        >
          Learn More About Us
          <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>

      {/* Decorative Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>
      </div>
    </section>
  );
};

export default AboutPreview;
