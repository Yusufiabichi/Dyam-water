
import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';

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

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';


export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<number | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const decodeTokenExp = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp as number | undefined;
    } catch (err) {
      return null;
    }
  };

  const scheduleRefresh = useCallback((token: string) => {
    clearRefreshTimer();
    const exp = decodeTokenExp(token);
    if (!exp) return;
    const now = Math.floor(Date.now() / 1000);
    // Refresh 2 minutes before expiry
    const refreshAt = (exp - 120 - now) * 1000;
    const timeout = Math.max(5 * 1000, refreshAt); // at least 5s
    refreshTimerRef.current = window.setTimeout(() => {
      refreshToken();
    }, timeout) as unknown as number;
  }, []);

  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem('dyam_admin_token');
    if (!token) {
      logout();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('dyam_admin_token', data.token);
        scheduleRefresh(data.token);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
    }
  }, [scheduleRefresh]);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('dyam_admin_token');
    const storedAdmin = localStorage.getItem('dyam_admin_session');
    if (token && storedAdmin) {
      // validate token by hitting /api/admin/me
      fetch(`${API_BASE}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then((data) => {
          setAdmin(data.admin);
          // schedule a refresh if token present
          const tokenVal = localStorage.getItem('dyam_admin_token');
          if (tokenVal) scheduleRefresh(tokenVal);
        })
        .catch((err) => {
          console.warn('Admin session validation failed:', err);
          localStorage.removeItem('dyam_admin_token');
          localStorage.removeItem('dyam_admin_session');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Try backend authentication first
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        // Authentication failed
        return false;
      }

      const data = await res.json();
      if (data?.token && data?.admin) {
        localStorage.setItem('dyam_admin_token', data.token);
        localStorage.setItem('dyam_admin_session', JSON.stringify(data.admin));
        setAdmin(data.admin);
        scheduleRefresh(data.token);
        return true;
      }
    } catch (err) {
      console.error('Login request failed:', err);
    }

    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('dyam_admin_session');
    localStorage.removeItem('dyam_admin_token');
    clearRefreshTimer();
  };

  useEffect(() => {
    return () => {
      clearRefreshTimer();
    };
  }, []);

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
