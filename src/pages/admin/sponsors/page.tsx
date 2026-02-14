
import { useEffect, useState } from 'react';
import { distributeToOptions } from '../../../mocks/sponsors';

interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  planName: string;
  amount: number;
  distributeTo: string;
  totalDonations: number;
  totalAmount: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  lastDonationDate: string | null;
  notes: string;
}

const AdminSponsorsPage = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/sponsors');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const rows = await res.json();

        const mapped: Sponsor[] = (rows || []).map((r: any) => ({
          id: String(r.id ?? r.sponsor_id ?? r.id),
          name: r.full_name || r.name || '',
          email: r.email || r.email_address || '',
          phone: r.phone_number || r.phone || '',
          company: r.company || '',
          planName: r.selected_plan || r.planName || r.plan || 'Basic Support',
          amount: Number(r.amount) || 0,
          distributeTo: r.distributed_to || r.distributeTo || 'Other',
          totalDonations: 0,
          totalAmount: 0,
          status: 'active',
          joinedDate: r.created_at ? String(r.created_at).split('T')[0] : (new Date().toISOString().split('T')[0]),
          lastDonationDate: r.paid_at || r.lastDonationDate || null,
          notes: r.notes || ''
        }));

        setSponsors(mapped);
        // Fetch transactions to compute totals
        try {
          const tRes = await fetch('http://localhost:4000/api/transactions');
          if (tRes.ok) {
            const txRows = await tRes.json();
            const successful = (txRows || []).filter((t: any) => (t.status || '').toLowerCase() === 'success');

            // overall totals
            const overallTotalRaised = successful.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
            const overallTotalDonations = successful.length;

            // per-sponsor aggregates
            const sponsorAgg = new Map<string, { count: number; amount: number }>();
            for (const t of successful) {
              const sid = String(t.sponsor_id ?? t.sponsorId ?? t.sponsor ?? '');
              if (!sid) continue;
              const curr = sponsorAgg.get(sid) || { count: 0, amount: 0 };
              curr.count += 1;
              curr.amount += Number(t.amount) || 0;
              sponsorAgg.set(sid, curr);
            }

            // merge aggregates into sponsors
            setSponsors((prev) => prev.map((s) => {
              const agg = sponsorAgg.get(s.id) || { count: 0, amount: 0 };
              return {
                ...s,
                totalDonations: agg.count,
                totalAmount: agg.amount
              };
            }));

            // update stats object values (local variables will read from sponsors state at render)
            // store overall totals in a ref-like state if needed
            // For now, set an ephemeral variable on window for debugging (no-op in prod)
            // eslint-disable-next-line no-console
            console.log('Sponsors totals', { overallTotalRaised, overallTotalDonations });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to load transactions for sponsor aggregates', e);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to load sponsors', e);
        setError(e?.message || 'Failed to load sponsors');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDistributeTo, setFilterDistributeTo] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    planName: 'Basic Support',
    amount: 25000,
    distributeTo: 'Mosques',
    status: 'pending' as 'active' | 'inactive' | 'pending',
    notes: '',
  });

  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch =
      sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sponsor.status === filterStatus;
    const matchesDistribute = filterDistributeTo === 'all' || sponsor.distributeTo === filterDistributeTo;
    return matchesSearch && matchesStatus && matchesDistribute;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getDistributeBadge = (distributeTo: string) => {
    const colors: Record<string, string> = {
      'Mosques': 'bg-emerald-100 text-emerald-700',
      'Orphanages': 'bg-pink-100 text-pink-700',
      'Hospitals': 'bg-sky-100 text-sky-700',
      'Churches': 'bg-violet-100 text-violet-700',
      'Ramadan Iftar Programs': 'bg-orange-100 text-orange-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[distributeTo] || colors['Other']}`}>
        {distributeTo}
      </span>
    );
  };

  const handleAddSponsor = () => {
    const newSponsor: Sponsor = {
      id: `sp-${Date.now()}`,
      ...formData,
      totalDonations: 0,
      totalAmount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastDonationDate: null,
    };
    setSponsors([newSponsor, ...sponsors]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSponsor = () => {
    if (!selectedSponsor) return;
    setSponsors(
      sponsors.map((sponsor) =>
        sponsor.id === selectedSponsor.id
          ? { ...sponsor, ...formData }
          : sponsor
      )
    );
    setShowEditModal(false);
    setSelectedSponsor(null);
    resetForm();
  };

  const handleDeleteSponsor = (id: string) => {
    if (window.confirm('Are you sure you want to remove this sponsor?')) {
      setSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
    }
  };

  const openEditModal = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      email: sponsor.email,
      phone: sponsor.phone,
      company: sponsor.company,
      planName: sponsor.planName,
      amount: sponsor.amount,
      distributeTo: sponsor.distributeTo,
      status: sponsor.status,
      notes: sponsor.notes,
    });
    setShowEditModal(true);
  };

  const openViewModal = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      planName: 'Basic Support',
      amount: 25000,
      distributeTo: 'Mosques',
      status: 'pending',
      notes: '',
    });
  };

  const stats = {
    total: sponsors.length,
    active: sponsors.filter((s) => s.status === 'active').length,
    totalRaised: sponsors.reduce((sum, s) => sum + s.totalAmount, 0),
    totalDonations: sponsors.reduce((sum, s) => sum + s.totalDonations, 0),
  };

  const planOptions = [
    { name: 'Basic Support', amount: 25000 },
    { name: 'Standard Care', amount: 50000 },
    { name: 'Premium Impact', amount: 100000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsors Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage charity water sponsors and donations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line text-lg"></i>
          Add Sponsor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-heart-line text-red-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Sponsors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-green-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500">Active Sponsors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-hand-heart-line text-amber-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              <p className="text-xs text-gray-500">Total Donations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-ocean-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₦{(stats.totalRaised / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Total Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={filterDistributeTo}
              onChange={(e) => setFilterDistributeTo(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Destinations</option>
              {distributeToOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sponsors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sponsor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Distribute To
                </th>
                
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSponsors.map((sponsor) => (
                <tr key={sponsor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{sponsor.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sponsor.company || sponsor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{sponsor.planName}</p>
                      <p className="text-xs text-gray-500">₦{sponsor.amount.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getDistributeBadge(sponsor.distributeTo)}
                  </td>
                  
                  <td className="px-6 py-4">{getStatusBadge(sponsor.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openViewModal(sponsor)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button
                        onClick={() => openEditModal(sponsor)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteSponsor(sponsor.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSponsors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-heart-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium">No sponsors found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add New Sponsor</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="Enter sponsor name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company/Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sponsorship Plan *</label>
                  <select
                    value={formData.planName}
                    onChange={(e) => {
                      const plan = planOptions.find(p => p.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        planName: e.target.value,
                        amount: plan?.amount || 25000
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} - ₦{plan.amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Distribute To *</label>
                  <select
                    value={formData.distributeTo}
                    onChange={(e) => setFormData({ ...formData, distributeTo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    {distributeToOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                  placeholder="Additional notes about this sponsor"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSponsor}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Add Sponsor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSponsor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Sponsor</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSponsor(null);
                    resetForm();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company/Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sponsorship Plan</label>
                  <select
                    value={formData.planName}
                    onChange={(e) => {
                      const plan = planOptions.find(p => p.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        planName: e.target.value,
                        amount: plan?.amount || 25000
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} - ₦{plan.amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'pending' })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Distribute To</label>
                <select
                  value={formData.distributeTo}
                  onChange={(e) => setFormData({ ...formData, distributeTo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                >
                  {distributeToOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSponsor(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSponsor}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedSponsor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Sponsor Details</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedSponsor(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Sponsor Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-heart-line text-2xl text-red-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSponsor.name}</h3>
                  {selectedSponsor.company && (
                    <p className="text-gray-500">{selectedSponsor.company}</p>
                  )}
                  <div className="mt-1">{getStatusBadge(selectedSponsor.status)}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <i className="ri-mail-line text-gray-400"></i>
                    <span className="text-gray-700">{selectedSponsor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <i className="ri-phone-line text-gray-400"></i>
                    <span className="text-gray-700">{selectedSponsor.phone}</span>
                  </div>
                </div>
              </div>

              {/* Sponsorship Info */}
              <div className="bg-red-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-red-700 mb-3">Sponsorship Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-red-600">Plan</p>
                    <p className="font-medium text-gray-900">{selectedSponsor.planName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600">Amount</p>
                    <p className="font-medium text-gray-900">₦{selectedSponsor.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600">Distribute To</p>
                    <p className="font-medium text-gray-900">{selectedSponsor.distributeTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-600">Joined</p>
                    <p className="font-medium text-gray-900">{new Date(selectedSponsor.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Donation Stats */}
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-green-700 mb-3">Donation History</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-green-600">Total Donations</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedSponsor.totalDonations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₦{selectedSponsor.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                {selectedSponsor.lastDonationDate && (
                  <p className="text-xs text-green-600 mt-3">
                    Last donation: {new Date(selectedSponsor.lastDonationDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Notes */}
              {selectedSponsor.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedSponsor.notes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedSponsor);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-edit-line mr-2"></i>
                Edit
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSponsor(null);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSponsorsPage;
