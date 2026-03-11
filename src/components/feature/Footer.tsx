
import { Link } from 'react-router-dom';
import { apiUrl } from '../../lib/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    
    try {
      const response = await fetch(apiUrl('messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: 'Newsletter Subscriber',
          email_address: email,
          phone: 'N/A',
          partnership_type: 'Newsletter',
          message: 'Newsletter subscription request',
        }),
      });

      if (response.ok) {
        const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (btn) {
          btn.textContent = 'Subscribed!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.disabled = false;
          }, 3000);
        }
        form.reset();
      }
    } catch (error) {
      // silent fail
    }
  };

  return (
    <footer className="bg-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://static.readdy.ai/image/6f2b631dac997628c51208e81abd8495/a5f9e0d89d96e9a4d5ccc2ddfdcd62fa.jpeg"
                alt="DYAM Natural Water - Premium Bottled Water Nigeria"
                title="DYAM Natural Water"
                className="h-14 w-auto bg-white rounded-lg p-1"
              />
            </div>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Premium <strong className="text-white/90">bottled water</strong> for everyday refreshment and impactful giving. Pure, refreshing, and purpose-driven.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-300 hover:bg-brand-500/20 transition-all cursor-pointer"
                aria-label="Follow DYAM Water on Facebook"
              >
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-300 hover:bg-brand-500/20 transition-all cursor-pointer"
                aria-label="Follow DYAM Water on Instagram"
              >
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-300 hover:bg-brand-500/20 transition-all cursor-pointer"
                aria-label="Follow DYAM Water on Twitter"
              >
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-300 hover:bg-brand-500/20 transition-all cursor-pointer"
                aria-label="Follow DYAM Water on LinkedIn"
              >
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about-us" className="text-sm text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-white/70 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/distribution-network" className="text-sm text-white/70 hover:text-white transition-colors">
                  Distribution Network
                </Link>
              </li>
              <li>
                <Link to="/charity-water" className="text-sm text-white/70 hover:text-charity-400 transition-colors">
                  Charity Water
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" target="_blank" className="text-sm text-white/70 hover:text-white transition-colors">
                  Manage
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start space-x-3">
                <i className="ri-map-pin-line text-brand-300 mt-1"></i>
                <span className="text-sm text-white/70">Kitwe street, Wuse, Abuja, Nigeria</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-phone-line text-brand-300 mt-1"></i>
                <span className="text-sm text-white/70">+234 701 439 6344</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-mail-line text-brand-300 mt-1"></i>
                <span className="text-sm text-white/70">info@dyamwater.com</span>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-white/70 mb-4">Stay updated on our impact</p>
            <form className="space-y-3" data-readdy-form id="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                aria-label="Email address for newsletter"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-brand-300 text-sm"
              />
              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white/70">
              &copy; {currentYear} DYAM Natural Water. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="/privacy-policy" className="text-sm text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-white/30">|</span>
              <a href="/terms" className="text-sm text-white/70 hover:text-white transition-colors">
                Terms
              </a>
              <span className="text-white/30">|</span>
              <a
                href="https://yusufias-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Developed by Yusufia Dev
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
