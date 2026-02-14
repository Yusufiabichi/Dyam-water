
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ProtectedRoute from '../components/admin/ProtectedRoute';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/content': 'Content Management',
  '/admin/charity-plans': 'Charity Plans',
  '/admin/transactions': 'Transactions',
  '/admin/messages': 'Messages',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Admin';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-64">
          <AdminHeader
            title={pageTitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
