
import { useState } from 'react';
import { charityPlansData } from '../../../mocks/adminContent';

interface CharityPlan {
  id: string;
  name: string;
  amount: number;
  description: string;
  impact: string;
  features: string[];
  isActive: boolean;
  isFeatured?: boolean;
  color: string;
}

const AdminCharityPlansPage = () => {
  const [plans, setPlans] = useState<CharityPlan[]>(charityPlansData);
  const [editingPlan, setEditingPlan] = useState<CharityPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<CharityPlan | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const colorOptions = [
    { value: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { value: 'ocean', label: 'Ocean', bg: 'bg-ocean-500' },
    { value: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { value: 'green', label: 'Green', bg: 'bg-green-500' },
    { value: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  ];

  const handleAddNew = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      name: '',
      amount: 0,
      description: '',
      impact: '',
      features: [''],
      isActive: true,
      color: 'ocean',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan: CharityPlan) => {
    setEditingPlan({ ...plan });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (plan: CharityPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (planToDelete) {
      setPlans(plans.filter(p => p.id !== planToDelete.id));
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
      showSaveStatus();
    }
  };

  const handleToggleActive = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
    showSaveStatus();
  };

  const handleToggleFeatured = (planId: string) => {
    setPlans(plans.map(p => ({
      ...p,
      isFeatured: p.id === planId ? !p.isFeatured : false,
    })));
    showSaveStatus();
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    const existingIndex = plans.findIndex(p => p.id === editingPlan.id);
    if (existingIndex >= 0) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
    } else {
      setPlans([...plans, editingPlan]);
    }

    setIsModalOpen(false);
    setEditingPlan(null);
    showSaveStatus();
  };

  const showSaveStatus = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPlan) return;
    const newFeatures = [...editingPlan.features];
    newFeatures[index] = value;
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const handleAddFeature = () => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan || editingPlan.features.length <= 1) return;
    const newFeatures = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Charity Plans</h1>
          <p className="text-gray-500 text-sm mt-1">Manage sponsorship plans for DYAM Charity Water</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus !== 'idle' && (
            <span className={`text-sm flex items-center gap-2 ${
              saveStatus === 'saving' ? 'text-amber-600' : 'text-green-600'
            }`}>
              {saveStatus === 'saving' ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-check-line"></i>
                  Saved
                </>
              )}
            </span>
          )}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            Add Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              plan.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Plan Header */}
            <div className={`p-6 ${
              plan.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              plan.color === 'ocean' ? 'bg-gradient-to-r from-ocean-500 to-ocean-600' :
              plan.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
              plan.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              'bg-gradient-to-r from-rose-500 to-rose-600'
            } text-white`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {plan.isFeatured && (
                    <span className="inline-block bg-white/20 text-xs font-bold px-2 py-1 rounded-full mb-2">
                      FEATURED
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  plan.isActive ? 'bg-white/20' : 'bg-red-500/50'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-3xl font-bold">₦{plan.amount.toLocaleString()}</div>
            </div>

            {/* Plan Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-green-800 mb-1">Impact</p>
                <p className="text-sm text-green-700">{plan.impact}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Features ({plan.features.length})</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="ri-check-line text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-gray-400">+{plan.features.length - 3} more</li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-ocean-600 hover:bg-ocean-50 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-edit-line"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleToggleFeatured(plan.id)}
                  className={`flex-1 flex items-center justify-center gap-1 text-sm py-2 rounded-lg transition-colors cursor-pointer ${
                    plan.isFeatured ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <i className={plan.isFeatured ? 'ri-star-fill' : 'ri-star-line'}></i>
                  Feature
                </button>
                <button
                  onClick={() => handleToggleActive(plan.id)}
                  className={`flex-1 flex items-center justify-center gap-1 text-sm py-2 rounded-lg transition-colors cursor-pointer ${
                    plan.isActive ? 'text-gray-500 hover:bg-gray-50' : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <i className={plan.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  {plan.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDeleteClick(plan)}
                  className="flex items-center justify-center gap-1 text-sm text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={handleAddNew}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-ocean-300 hover:text-ocean-500 transition-colors cursor-pointer min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i className="ri-add-line text-3xl"></i>
          </div>
          <span className="font-medium">Add New Plan</span>
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {plans.find(p => p.id === editingPlan.id) ? 'Edit Plan' : 'Add New Plan'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                    placeholder="e.g., Basic, Standard, Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦) *</label>
                  <input
                    type="number"
                    value={editingPlan.amount}
                    onChange={(e) => setEditingPlan({ ...editingPlan, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                    placeholder="25000"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                  placeholder="Brief description of the plan"
                />
              </div>

              {/* Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact Summary *</label>
                <textarea
                  value={editingPlan.impact}
                  onChange={(e) => setEditingPlan({ ...editingPlan, impact: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm resize-none"
                  placeholder="Describe the impact this sponsorship will have"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditingPlan({ ...editingPlan, color: color.value })}
                      className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center transition-all cursor-pointer ${
                        editingPlan.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    >
                      {editingPlan.color === color.value && (
                        <i className="ri-check-line text-white"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={handleAddFeature}
                    className="text-sm text-ocean-600 hover:text-ocean-700 font-medium cursor-pointer"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                        placeholder={`Feature ${index + 1}`}
                      />
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        disabled={editingPlan.features.length <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex gap-6 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-ocean-500 focus:ring-ocean-500"
                  />
                  <span className="text-sm text-gray-700">Active (visible on website)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isFeatured || false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">Featured plan</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                disabled={!editingPlan.name || !editingPlan.amount || !editingPlan.description}
                className="px-6 py-2 bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && planToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-3xl text-red-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Plan?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{planToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCharityPlansPage;
