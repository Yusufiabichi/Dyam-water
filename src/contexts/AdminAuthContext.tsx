
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  email: string;
  name: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Demo credentials - In production, this would be handled by Supabase
const DEMO_ADMIN = {
  email: 'dev@dyamwater.com',
  password: 'admin123',
  name: 'DYAM Admin',
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedAdmin = localStorage.getItem('dyam_admin_session');
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setAdmin(parsed);
      } catch (error) {
        // If parsing fails, clean up the corrupted session data
        console.error('Failed to parse admin session from localStorage:', error);
        localStorage.removeItem('dyam_admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - Replace with Supabase auth in production
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const adminUser = { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name };
      setAdmin(adminUser);
      localStorage.setItem('dyam_admin_session', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('dyam_admin_session');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
