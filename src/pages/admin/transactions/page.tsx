import { useState, useMemo, useEffect } from 'react';

interface Transaction {
  id: string;
  reference: string;
  donorName: string;
  sponsorName: string;
  email: string;
  phone: string;
  amount: number;
  plan: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  paymentMethod: string;
  currency: string;
}

const extractNameEmail = (donorInfo: any): { name: string; email: string } => {
  if (typeof donorInfo === 'string') {
    try {
      const parsed = JSON.parse(donorInfo);
      return {
        name: parsed.name || parsed.full_name || parsed.donorName || '',
        email: parsed.email || parsed.email_address || ''
      };
    } catch (e) {
      return { name: donorInfo, email: '' };
    }
  }
  return {
    name: donorInfo?.name || donorInfo?.full_name || donorInfo?.donorName || '',
    email: donorInfo?.email || donorInfo?.email_address || ''
  };
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Fetch transactions and sponsors
        const txnRes = await fetch('http://localhost:4000/api/transactions');
        if (!txnRes.ok) throw new Error(`Failed to fetch transactions: ${txnRes.status}`);
        const txnRows = await txnRes.json();

        const sponsorRes = await fetch('http://localhost:4000/api/sponsors');
        const sponsors = sponsorRes.ok ? await sponsorRes.json() : [];
        const sponsorMap = new Map(sponsors.map((s: any) => [s.id, s.full_name || '']));

        const mapped = (txnRows || []).map((row: any) => {
          const { name, email } = extractNameEmail(row.donor_information);
          const sponsorName = sponsorMap.get(row.sponsor_id) || '';
          return {
            id: String(row.id),
            reference: row.reference || '',
            donorName: name,
            sponsorName: sponsorName,
            email: email,
            phone: '',
            amount: Number(row.amount) || 0,
            plan: row.plan || '',
            status: (row.status || 'pending') as 'success' | 'pending' | 'failed',
            date: row.date_time ? new Date(row.date_time).toISOString() : new Date().toISOString(),
            paymentMethod: row.payment_method || 'Card',
            currency: 'NGN'
          };
        });
        setTransactions(mapped);
        setError(null);
      } catch (e: any) {
        console.error('Failed to load transactions', e);
        setError(e?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = 
        txn.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      const matchesPlan = planFilter === 'all' || txn.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [transactions, searchTerm, statusFilter, planFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, txn) => 
      txn.status === 'success' ? sum + txn.amount : sum, 0
    );
    const successCount = transactions.filter(txn => txn.status === 'success').length;
    const pendingCount = transactions.filter(txn => txn.status === 'pending').length;
    const failedCount = transactions.filter(txn => txn.status === 'failed').length;

    return { total, successCount, pendingCount, failedCount };
  }, [transactions]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Reference', 'Donor Name', 'Email', 'Phone', 'Amount', 'Plan', 'Status', 'Date', 'Payment Method'];
    const csvData = filteredTransactions.map(txn => [
      txn.reference,
      txn.donorName,
      txn.email,
      txn.phone,
      `${txn.currency} ${txn.amount.toLocaleString()}`,
      txn.plan,
      txn.status,
      new Date(txn.date).toLocaleString(),
      txn.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dyam-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const uniquePlans = Array.from(new Set(transactions.map(txn => txn.plan)));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Tracking</h1>
        <p className="text-gray-600">Monitor and manage all charity sponsorship payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-xl text-emerald-600"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{stats.total.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">{stats.successCount} successful payments</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Successful</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-xl text-emerald-600"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.successCount}</p>
          <p className="text-sm text-gray-500 mt-1">Completed transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-amber-600"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Failed</span>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-circle-line text-xl text-red-600"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.failedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Unsuccessful attempts</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="all">All Plans</option>
              {uniquePlans.map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
          </p>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
          >
            <i className="ri-download-line"></i>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="ri-file-text-line text-gray-400"></i>
                      <span className="text-sm font-medium text-gray-900">{txn.reference}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{txn.donorName}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{txn.sponsorName}</p>
                      <p className="text-xs text-gray-400">{txn.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{txn.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {txn.currency} {txn.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(txn.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTransaction(txn)}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                </span>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Reference ID</label>
                  <p className="text-sm font-medium text-gray-900">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
                  <p className="text-sm font-medium text-gray-900">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date & Time</label>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
                  <p className="text-sm font-medium text-gray-900">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              {/* Donor Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-sm font-medium text-gray-900">{selectedTransaction.donorName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <p className="text-sm font-medium text-gray-900">{selectedTransaction.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-sm font-medium text-gray-900">{selectedTransaction.phone}</p>
                  </div>
                </div>
              </div>

              {/* Plan Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsorship Plan</h3>
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-teal-900">{selectedTransaction.plan}</p>
                  <p className="text-xs text-teal-700 mt-1">Charity Water Sponsorship</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors whitespace-nowrap"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const txn = selectedTransaction;
                  const content = `
Transaction Details
==================
Reference: ${txn.reference}
Transaction ID: ${txn.id}
Status: ${txn.status}
Amount: ${txn.currency} ${txn.amount.toLocaleString()}
Date: ${formatDate(txn.date)}
Payment Method: ${txn.paymentMethod}

Donor Information
=================
Name: ${txn.donorName}
Email: ${txn.email}
Phone: ${txn.phone}

Plan: ${txn.plan}
                  `.trim();

                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `transaction-${txn.reference}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}