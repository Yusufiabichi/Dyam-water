
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const AdminHeader = ({ title, onMenuClick }: AdminHeaderProps) => {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <i className="ri-menu-line text-xl text-gray-700"></i>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors relative cursor-pointer">
          <i className="ri-notification-3-line text-xl text-gray-600"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-ocean-500 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-white"></i>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
