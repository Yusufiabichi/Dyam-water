
import { useEffect, useState } from 'react';
import { regionsData } from '../../../mocks/distributors';

interface Distributor {
  id: string | number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  region: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  totalOrders: number;
  lastOrderDate: string | null;
}

const AdminDistributorsPage = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    region: '',
    address: '',
    status: 'pending' as 'active' | 'inactive' | 'pending',
  });

  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/distributors');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const rows = await res.json();

        const mapped: Distributor[] = (rows || []).map((r: any) => ({
          id: String(r.id),
          name: r.full_name || '',
          contactPerson: '', // Not in database schema
          phone: r.phone || '',
          email: r.email || '',
          region: r.location || '',
          address: r.business_type || '',
          status: 'active' as const, // Default to active for all fetched records
          joinedDate: r.created_at ? String(r.created_at).split('T')[0] : (new Date().toISOString().split('T')[0]),
          totalOrders: 0,
          lastOrderDate: null,
        }));

        setDistributors(mapped);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to load distributors', e);
        setError(e?.message || 'Failed to load distributors');
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  const filteredDistributors = distributors.filter((dist) => {
    const matchesSearch =
      dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || dist.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || dist.region === filterRegion;
    return matchesSearch && matchesStatus && matchesRegion;
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

  const handleAddDistributor = () => {
    const newDistributor: Distributor = {
      id: `dist-${Date.now()}`,
      ...formData,
      joinedDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      lastOrderDate: null,
    };
    setDistributors([newDistributor, ...distributors]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditDistributor = () => {
    if (!selectedDistributor) return;
    setDistributors(
      distributors.map((dist) =>
        dist.id === selectedDistributor.id
          ? { ...dist, ...formData }
          : dist
      )
    );
    setShowEditModal(false);
    setSelectedDistributor(null);
    resetForm();
  };

  const handleDeleteDistributor = (id: string) => {
    if (window.confirm('Are you sure you want to remove this distributor?')) {
      setDistributors(distributors.filter((dist) => dist.id !== id));
    }
  };

  const openEditModal = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setFormData({
      name: distributor.name,
      contactPerson: distributor.contactPerson,
      phone: distributor.phone,
      email: distributor.email,
      region: distributor.region,
      address: distributor.address,
      status: distributor.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      region: '',
      address: '',
      status: 'pending',
    });
  };

  const stats = {
    total: distributors.length,
    active: distributors.filter((d) => d.status === 'active').length,
    inactive: distributors.filter((d) => d.status === 'inactive').length,
    pending: distributors.filter((d) => d.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distributors Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your distribution network partners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line text-lg"></i>
          Add Distributor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
              <i className="ri-truck-line text-ocean-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Distributors</p>
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
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className="ri-pause-circle-line text-gray-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-amber-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
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
              placeholder="Search distributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Regions</option>
              {regionsData.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Distributors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading distributors...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Distributor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Region
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orders
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
              {filteredDistributors.map((distributor) => (
                <tr key={distributor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{distributor.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{distributor.contactPerson}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <i className="ri-map-pin-line text-gray-400"></i>
                      {distributor.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-700">{distributor.phone}</p>
                      <p className="text-gray-500 text-xs">{distributor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{distributor.totalOrders.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {distributor.lastOrderDate
                          ? `Last: ${new Date(distributor.lastOrderDate).toLocaleDateString()}`
                          : 'No orders yet'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(distributor.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(distributor)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteDistributor(String(distributor.id))}
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

            {filteredDistributors.length === 0 && (
              <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-truck-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium">No distributors found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add New Distributor</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm cursor-pointer"
                >
                  <option value="">Select region</option>
                  {regionsData.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm resize-none"
                  placeholder="Enter full address"
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
                onClick={handleAddDistributor}
                disabled={!formData.name || !formData.contactPerson || !formData.region}
                className="flex-1 px-4 py-2.5 bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Add Distributor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Distributor</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDistributor(null);
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    {regionsData.map((region) => (
                      <option key={region} value={region}>
                        {region}
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDistributor(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDistributor}
                className="flex-1 px-4 py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDistributorsPage;
