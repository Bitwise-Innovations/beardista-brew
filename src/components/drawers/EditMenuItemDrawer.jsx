import React, { useState, useEffect } from 'react';

const CATEGORY_OPTIONS = [
  'Signatures',
  'Specialty Coffee',
  'Competition Artisans',
  'Milk Creations',
  'Zero-Proof',
  'Matcha',
  'Foam Series',
  'Bespokes',
  'Savory Bites',
  'Pasta',
  'Rice',
  'Salad',
  'Extras'
];

export const EditMenuItemDrawer = ({ isOpen, item, onClose, onSave, onArchive }) => {
  const isEditing = Boolean(item && item.id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Espresso & Coffee',
    price: 150,
    availability: true,
    image: '',
    description: '',
    flavorProfile: '',
    allergens: 'None'
  });

  const [error, setError] = useState('');
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Espresso & Coffee',
        price: item.price || 150,
        availability: item.availability !== undefined ? item.availability : true,
        image: item.image || '',
        description: item.description || '',
        flavorProfile: item.flavorProfile || '',
        allergens: item.allergens || 'None'
      });
    } else {
      setFormData({
        name: '',
        category: 'Espresso & Coffee',
        price: 150,
        availability: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
        description: '',
        flavorProfile: '',
        allergens: 'None'
      });
    }
    setError('');
    setShowArchiveConfirm(false);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Item title is required.');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Please provide a valid price.');
      return;
    }

    const payload = {
      ...(item || {}),
      id: item ? item.id : `menu-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      availability: formData.availability,
      image: formData.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      description: formData.description.trim(),
      flavorProfile: formData.flavorProfile.trim(),
      allergens: formData.allergens.trim()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#19244E] text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#E58422] flex items-center justify-center text-white font-bold text-sm">
                {isEditing ? '✎' : '+'}
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight">
                  {isEditing ? `Edit: ${item.name}` : 'Add New Menu Item'}
                </h3>
                <p className="text-[11px] text-[#FFF3E7]/70">
                  {isEditing ? 'Modify product details and pricing' : 'Expand digital menu inventory'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body Form */}
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Quick Preview Thumbnail & Availability Bar */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4">
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover bg-gray-200 border border-gray-300 flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#19244E]">Status:</span>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      formData.availability
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {formData.availability ? 'Available for Ordering' : 'Currently Out of Stock'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('availability', !formData.availability)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      formData.availability ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.availability ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-gray-600">
                    {formData.availability ? 'In Stock (Live)' : 'Mark Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Alon at Apoy"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                required
              />
            </div>

            {/* Category & Price in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Price (PHP ₱) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Image Source URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Detailed Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe tasting experience, brewing method, and specialty ingredients..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* Flavor Profile */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Flavor Profile Notes
              </label>
              <input
                type="text"
                value={formData.flavorProfile}
                onChange={(e) => handleChange('flavorProfile', e.target.value)}
                placeholder="e.g. Smoky, bittersweet cacao, caramelized citrus"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Contains / Allergens */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Contains / Allergens
              </label>
              <input
                type="text"
                value={formData.allergens}
                onChange={(e) => handleChange('allergens', e.target.value)}
                placeholder="e.g. Dairy, Tree Nuts, Gluten or None"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
              />
            </div>
          </form>

          {/* Archive Confirmation Banner */}
          {showArchiveConfirm && (
            <div className="p-4 bg-rose-50 border-t border-rose-200 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700">
                Are you sure you want to remove {formData.name}?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowArchiveConfirm(false)}
                  className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onArchive(item);
                    onClose();
                  }}
                  className="px-3 py-1 bg-rose-600 text-xs font-bold text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Archive
                </button>
              </div>
            </div>
          )}

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            {isEditing && !showArchiveConfirm ? (
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(true)}
                className="px-4 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Archive</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Add to Menu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
