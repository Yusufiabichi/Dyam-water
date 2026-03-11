import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../../lib/api';

type FrontTxn = {
  id: number | string;
  reference?: string;
  donorName?: string;
  email?: string;
  sponsor_id?: number;
  amount: number;
  plan?: string;
  status?: string;
  date?: string;
};

const AdminDashboardPage = () => {
  const [transactions, setTransactions] = useState<FrontTxn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl('transactions'));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const rows = await res.json();

        // Map backend rows to frontend transaction shape
        const extractNameEmail = (obj: any) => {
          const result = { name: '', email: '' };
          if (!obj) return result;

          const nameKeys = ['name', 'full_name', 'fullName', 'donorName', 'donor_name', 'first_name', 'firstname'];
          const emailKeys = ['email', 'email_address', 'donor_email', 'payer_email', 'customer_email'];

          const findInObject = (o: any) => {
            if (!o || typeof o !== 'object') return;
            for (const k of nameKeys) {
              if (k in o && o[k]) {
                result.name = o[k];
                break;
              }
            }
            for (const k of emailKeys) {
              if (k in o && o[k]) {
                result.email = o[k];
                break;
              }
            }
            // check nested objects if not found
            for (const v of Object.values(o)) {
              if ((result.name && result.email) || typeof v !== 'object' || !v) continue;
              findInObject(v);
            }
          };

          findInObject(obj);
          return result;
        };

        const mapped: FrontTxn[] = (rows || []).map((r: any) => {
          let donorName = '';
          let email = '';

          if (r.donor_information) {
            try {
              const parsed = typeof r.donor_information === 'string'
                ? JSON.parse(r.donor_information)
                : r.donor_information;

              if (typeof parsed === 'string') {
                donorName = parsed;
              } else {
                const res = extractNameEmail(parsed);
                donorName = res.name || '';
                email = res.email || '';
              }
            } catch (e) {
              donorName = typeof r.donor_information === 'string' ? r.donor_information : '';
            }
          }

          // fallback to other possible top-level columns
          donorName = donorName || r.donorName || r.donor_name || r.name || r.full_name || '';
          email = email || r.email || r.email_address || r.donor_email || r.payer_email || '';

          return {
            id: r.id,
            reference: r.reference,
            donorName: donorName,
            email: email,
            amount: Number(r.amount) || 0,
            plan: r.plan || r.planName || '',
            status: (r.status || '').toLowerCase(),
            sponsor_id: r.sponsor_id,
            date: r.paid_at || r.date_time || r.date || r.created_at || ''
          };
        });

        setTransactions(mapped);

        // If transactions reference sponsors but lack donor info, fetch sponsor details
        const sponsorIds = Array.from(new Set(mapped
          .filter((t: any) => (!t.donorName || t.donorName === '') && (t.sponsor_id != null))
          .map((t: any) => t.sponsor_id)
        ));

        if (sponsorIds.length) {
          try {
            const sponsorFetches = sponsorIds.map((id) =>
              fetch(apiUrl(`sponsors/${id}`)).then((r) => r.ok ? r.json() : null).catch(() => null)
            );

            const sponsors = await Promise.all(sponsorFetches);
            const sponsorMap = new Map<number, any>();
            sponsors.forEach((s) => { if (s && s.id) sponsorMap.set(Number(s.id), s); });

            setTransactions((prev) => prev.map((tx) => {
              if ((!tx.donorName || tx.donorName === '') && tx.sponsor_id && sponsorMap.has(Number(tx.sponsor_id))) {
                const s = sponsorMap.get(Number(tx.sponsor_id));
                return {
                  ...tx,
                  donorName: tx.donorName || s.full_name || s.name || '',
                  email: tx.email || s.email || ''
                };
              }
              return tx;
            }));
          } catch (e) {
            // ignore enrichment errors
            // eslint-disable-next-line no-console
            console.error('Sponsor enrichment failed', e);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate real stats from transactions
  const successfulTransactions = transactions.filter(txn => txn.status === 'success');
  const totalRevenue = successfulTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const uniqueSponsors = new Set(successfulTransactions.map(txn => txn.email)).size;

  // Get current month transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = successfulTransactions.filter(txn => {
    const txnDate = new Date(txn.date || '');
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);

  // Calculate plan performance
  const planStats = transactions.reduce((acc, txn) => {
    if (txn.status === 'success') {
      const plan = txn.plan || 'Unknown';
      if (!acc[plan]) {
        acc[plan] = { count: 0, revenue: 0 };
      }
      acc[plan].count += 1;
      acc[plan].revenue += txn.amount || 0;
    }
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const stats = [
    {
      label: 'Total Donations',
      value: `₦${totalRevenue.toLocaleString()}`,
      change: `${successfulTransactions.length} payments`,
      icon: 'ri-money-dollar-circle-line',
      color: 'ocean',
    },
    {
      label: 'Sponsors',
      value: uniqueSponsors.toString(),
      change: `${successfulTransactions.length} donations`,
      icon: 'ri-user-heart-line',
      color: 'green',
    },
    {
      label: 'Active Plans',
      value: '3',
      change: 'All active',
      icon: 'ri-file-list-3-line',
      color: 'amber',
    },
    {
      label: 'This Month',
      value: `₦${monthlyRevenue.toLocaleString()}`,
      change: `${monthlyTransactions.length} payments`,
      icon: 'ri-calendar-line',
      color: 'rose',
    },
  ];

  const colorClasses: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    ocean: { bg: 'bg-ocean-50', text: 'text-ocean-600', icon: 'bg-ocean-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'bg-rose-500' },
  };

  const getColors = (colorKey: string) => {
    return (
      colorClasses[colorKey] ?? {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        icon: 'bg-gray-500',
      }
    );
  };

  // Get recent 5 transactions from backend-fetched data
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-700 to-ocean-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to DYAM Admin</h2>
        <p className="text-white/80 text-sm">
          Manage your website content, charity plans, and track donations all in
          one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colors = getColors(stat.color);
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 ${colors.icon} rounded-lg flex items-center justify-center`}
                >
                  <i className={`${stat.icon} text-white text-xl`}></i>
                </div>
                <span
                  className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded-full`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/charity-plans"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-ocean-50 hover:bg-ocean-100 text-ocean-700 transition-colors"
            >
              <i className="ri-add-circle-line text-xl"></i>
              <span className="text-sm font-medium">Add Charity Plan</span>
            </Link>
            <Link
              to="/admin/content"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
            >
              <i className="ri-file-edit-line text-xl"></i>
              <span className="text-sm font-medium">Edit Content</span>
            </Link>
            <Link
              to="/admin/transactions"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
            >
              <i className="ri-download-2-line text-xl"></i>
              <span className="text-sm font-medium">Export Transactions</span>
            </Link>
            <Link
              to="/"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <i className="ri-external-link-line text-xl"></i>
              <span className="text-sm font-medium">View Website</span>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <Link
              to="/admin/transactions"
              className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-ocean-200 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-ocean-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-hand-heart-line text-ocean-600"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {txn.donorName}
                    </p>
                    <p className="text-xs text-gray-500">{txn.plan}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₦{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(txn.date)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charity Plans Overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Charity Plans Performance
          </h3>
          <Link
            to="/admin/charity-plans"
            className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
          >
            Manage Plans
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-xl p-5 hover:border-ocean-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">
                Basic Plan
              </span>
              <span className="text-xs bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">₦10,000</p>
            <p className="text-sm text-gray-500 mb-4">
              {planStats['Basic Plan']?.count || 0} sponsors • ₦{(planStats['Basic Plan']?.revenue || 0).toLocaleString()}
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-ocean-500 rounded-full"
                style={{ 
                  width: `${Math.min(100, ((planStats['Basic Plan']?.count || 0) / successfulTransactions.length) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="border border-gray-200 rounded-xl p-5 hover:border-ocean-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">
                Standard Plan
              </span>
              <span className="text-xs bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">₦25,000</p>
            <p className="text-sm text-gray-500 mb-4">
              {planStats['Standard Plan']?.count || 0} sponsors • ₦{(planStats['Standard Plan']?.revenue || 0).toLocaleString()}
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-ocean-500 rounded-full"
                style={{ 
                  width: `${Math.min(100, ((planStats['Standard Plan']?.count || 0) / successfulTransactions.length) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border border-gray-200 rounded-xl p-5 hover:border-ocean-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">
                Premium Plan
              </span>
              <span className="text-xs bg-ocean-100 text-ocean-700 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">₦50,000</p>
            <p className="text-sm text-gray-500 mb-4">
              {planStats['Premium Plan']?.count || 0} sponsors • ₦{(planStats['Premium Plan']?.revenue || 0).toLocaleString()}
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-ocean-500 rounded-full"
                style={{ 
                  width: `${Math.min(100, ((planStats['Premium Plan']?.count || 0) / successfulTransactions.length) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
