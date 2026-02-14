import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'ri-dashboard-line',
    },
    {
      name: 'Distributors',
      path: '/admin/distributors',
      icon: 'ri-truck-line',
    },
    {
      name: 'Charity Plans',
      path: '/admin/charity-plans',
      icon: 'ri-heart-line',
    },
    {
      name: 'Sponsors',
      path: '/admin/sponsors',
      icon: 'ri-user-heart-line',
    },
    {
      name: 'Transactions',
      path: '/admin/transactions',
      icon: 'ri-exchange-dollar-line',
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: 'ri-message-3-line',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Wrap logout in a safe async handler
  const handleLogout = async () => {
    try {
      await logout?.();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show a user‑friendly message here
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-navy-800 text-white z-50
          transform transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <img
              src="https://public.readdy.ai/ai/img_res/0567d353-d7a5-46dc-8fa1-bf10faa1ffe1.png"
              alt="DYAM"
              className="h-8 w-auto"
            />
            <span className="font-semibold text-sm">Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-ocean-500 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-lg"></i>
            </div>
            <div>
              <p className="text-sm font-medium">{admin?.name}</p>
              <p className="text-xs text-white/60">{admin?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                ${isActive(item.path)
                  ? 'bg-ocean-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'}
              `}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-all mb-1"
          >
            <i className="ri-external-link-line text-lg"></i>
            <span className="text-sm font-medium">View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
          >
            <i className="ri-logout-box-line text-lg"></i>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
