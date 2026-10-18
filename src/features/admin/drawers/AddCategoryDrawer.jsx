import React, { useState } from 'react';

const INITIAL_ICON_OPTIONS = [
  { id: 'coffee', icon: '☕', label: 'Coffee' },
  { id: 'cup', icon: '🥤', label: 'Cold Drink' },
  { id: 'croissant', icon: '🥐', label: 'Pastry' },
  { id: 'sparkles', icon: '✨', label: 'Specialty' },
  { id: 'flame', icon: '🔥', label: 'Artisan' },
  { id: 'bowl', icon: '🍜', label: 'Food / Pasta' },
  { id: 'leaf', icon: '🍃', label: 'Matcha / Tea' },
  { id: 'cake', icon: '🍰', label: 'Dessert' }
];

const QUICK_EMOJIS = [
  { icon: '🧋', label: 'Boba / Milk Tea' },
  { icon: '🥪', label: 'Sandwiches' },
  { icon: '🥗', label: 'Salads' },
  { icon: '🥑', label: 'Avocado Toast' },
  { icon: '🧇', label: 'Waffles' },
  { icon: '🍩', label: 'Donuts' },
  { icon: '🍕', label: 'Flatbread' },
  { icon: '🍷', label: 'Wine / Cocktails' },
  { icon: '🍺', label: 'Craft Brews' },
  { icon: '🫖', label: 'Loose Teas' },
  { icon: '🧊', label: 'Cold Brew' },
  { icon: '🍋', label: 'Citrus' },
  { icon: '🍫', label: 'Chocolates' },
  { icon: '🥯', label: 'Bagels' },
  { icon: '🥞', label: 'Pancakes' },
  { icon: '🌮', label: 'Tacos' }
];

const COLOR_OPTIONS = [
  { id: 'orange', hex: '#E58422', label: 'Amber Orange' },
  { id: 'navy', hex: '#19244E', label: 'Deep Navy' },
  { id: 'emerald', hex: '#10B981', label: 'Mint Emerald' },
  { id: 'rose', hex: '#F43F5E', label: 'Rose Red' },
  { id: 'purple', hex: '#8B5CF6', label: 'Purple' },
  { id: 'amber', hex: '#F59E0B', label: 'Gold Amber' }
];

const DEPARTMENT_OPTIONS = [
  'Beverages & Espresso',
  'Signature Creations',
  'Savory Kitchen & Pasta',
  'Bakery & Bar Bites',
  'Matcha & Tea Bar',
  'Merchandise & Retail'
];

export const AddCategoryDrawer = ({ isOpen, onClose, onSave }) => {
  const [iconOptions, setIconOptions] = useState(INITIAL_ICON_OPTIONS);
  const [selectedIcon, setSelectedIcon] = useState('☕');
  const [isAddingCustomIcon, setIsAddingCustomIcon] = useState(false);
  const [customIconInput, setCustomIconInput] = useState('');
  const [customLabelInput, setCustomLabelInput] = useState('');
  const [customIconImage, setCustomIconImage] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortPriority, setSortPriority] = useState('1');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Beverages & Espresso');
  const [tagColor, setTagColor] = useState('#E58422');
  const [publishToOnlineMenu, setPublishToOnlineMenu] = useState(true);
  const [error, setError] = useState('');

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setCustomIconImage(result);
        if (!customLabelInput) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setCustomLabelInput(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomIcon = () => {
    const iconVal = customIconImage || customIconInput.trim();
    if (!iconVal) return;

    const labelVal = customLabelInput.trim() || 'Custom Icon';
    const newEntry = {
      id: `custom-${Date.now()}`,
      icon: iconVal,
      label: labelVal
    };

    setIconOptions((prev) => [...prev, newEntry]);
    setSelectedIcon(iconVal);
    setIsAddingCustomIcon(false);
    setCustomIconInput('');
    setCustomLabelInput('');
    setCustomIconImage('');
  };

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
    if (error) setError('');
  };

  const handleSubmit = (isDraft = false) => {
    if (!name.trim()) {
      setError('Please enter a valid category name.');
      return;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      icon: selectedIcon,
      department,
      tagColor,
      publishToOnlineMenu: isDraft ? false : publishToOnlineMenu,
      isDraft,
      count: 0,
      description: description.trim(),
      sortPriority: parseInt(sortPriority, 10) || 1
    };

    onSave(newCategory);
    // Reset form
    setName('');
    setSlug('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Right-aligned sliding drawer panel */}
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#19244E] text-white flex items-center justify-between border-b border-[#24336c]">
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base shadow-sm font-bold overflow-hidden"
                style={{ backgroundColor: tagColor }}
              >
                {selectedIcon.startsWith('data:') || selectedIcon.startsWith('http') ? (
                  <img src={selectedIcon} alt="Badge Icon" className="w-5 h-5 object-contain" />
                ) : (
                  selectedIcon
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white">Add Category</h3>
                <p className="text-[11px] text-[#FFF3E7]/70">Configure taxonomy, badge, and live menu status</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body Form */}
          <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* 1. Category Icon & Visual Badge selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider">
                  Category Icon & Visual Badge
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomIcon((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E58422] hover:text-[#c76e19] transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{isAddingCustomIcon ? 'Close Adder' : 'Add Icon'}</span>
                </button>
              </div>

              {/* Icon Selection Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                {iconOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.icon)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedIcon === item.icon
                        ? 'border-[#E58422] bg-[#FFF3E7] text-[#19244E] ring-2 ring-[#E58422]/20 font-bold'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl flex items-center justify-center w-7 h-7">
                      {item.icon.startsWith('data:') || item.icon.startsWith('http') ? (
                        <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                      ) : (
                        item.icon
                      )}
                    </span>
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                ))}

                {/* + Add Icon Button */}
                <button
                  type="button"
                  onClick={() => setIsAddingCustomIcon(true)}
                  className="p-2.5 rounded-xl border-2 border-dashed border-[#E58422]/40 hover:border-[#E58422] hover:bg-[#FFF3E7]/40 text-[#19244E] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group min-h-[64px]"
                  title="Add custom icon or upload badge image"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#FFF3E7] group-hover:bg-[#E58422] group-hover:text-white flex items-center justify-center text-[#E58422] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#E58422]">Add Icon</span>
                </button>
              </div>

              {/* Add Custom Icon Drawer / Inline Panel */}
              {isAddingCustomIcon && (
                <div className="mt-3 p-4 bg-[#FFF9F3] border border-[#E58422]/30 rounded-2xl space-y-3 animate-fadeIn shadow-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E58422]/15">
                    <div className="font-bold text-xs text-[#19244E] flex items-center gap-1.5">
                      <span className="text-[#E58422]">✨</span>
                      <span>Add New Category Icon</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomIcon(false)}
                      className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 1. Quick Select Cafe & Food Emojis */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                      Quick Pick Popular Emoji
                    </label>
                    <div className="grid grid-cols-8 gap-1.5">
                      {QUICK_EMOJIS.map((item) => (
                        <button
                          key={item.icon}
                          type="button"
                          onClick={() => {
                            setCustomIconInput(item.icon);
                            setCustomIconImage('');
                            if (!customLabelInput) setCustomLabelInput(item.label);
                          }}
                          className={`h-8 rounded-lg text-base border flex items-center justify-center transition-all cursor-pointer ${
                            customIconInput === item.icon && !customIconImage
                              ? 'border-[#E58422] bg-[#FFF3E7] ring-2 ring-[#E58422]/30 scale-105 font-bold'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          title={item.label}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Custom Character / Emoji & Label Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Emoji or 1-2 Char Symbol
                      </label>
                      <input
                        type="text"
                        value={customIconInput}
                        onChange={(e) => {
                          setCustomIconInput(e.target.value);
                          if (e.target.value) setCustomIconImage('');
                        }}
                        placeholder="e.g. 🥪 or B"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Icon Label Name
                      </label>
                      <input
                        type="text"
                        value={customLabelInput}
                        onChange={(e) => setCustomLabelInput(e.target.value)}
                        placeholder="e.g. Artisanal Sandwiches"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Upload Custom PNG / SVG Image */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Or Upload Custom Icon Image (PNG / SVG)
                    </label>
                    <label className="flex items-center justify-between px-3.5 py-2 border border-dashed border-gray-300 hover:border-[#E58422] bg-white rounded-xl cursor-pointer text-xs text-gray-600 transition-colors">
                      <div className="flex items-center gap-2">
                        {customIconImage ? (
                          <img src={customIconImage} alt="Uploaded" className="w-5 h-5 object-contain rounded" />
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                        <span className="text-[11px] font-medium text-gray-700 truncate max-w-[200px]">
                          {customIconImage ? 'Custom image loaded ✓' : 'Choose PNG/SVG icon file...'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#E58422] bg-[#FFF3E7] px-2 py-0.5 rounded-lg">
                        Browse
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg"
                        onChange={handleIconUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomIcon(false);
                        setCustomIconInput('');
                        setCustomLabelInput('');
                        setCustomIconImage('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomIcon}
                      disabled={!customIconInput.trim() && !customIconImage}
                      className="px-4 py-1.5 bg-[#E58422] hover:bg-[#d07317] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Add & Select Icon
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Category Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Competition Artisans"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Category Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. competition-artisans"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* 3. Department / Group & Sort Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Department / Group
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all cursor-pointer"
                >
                  {DEPARTMENT_OPTIONS.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Sort Priority (Order)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={sortPriority}
                  onChange={(e) => setSortPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* 4. Tag Highlight Color Picker */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Tag Highlight Color
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setTagColor(col.hex)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      tagColor === col.hex
                        ? 'border-gray-900 bg-gray-100 shadow-xs ring-1 ring-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Description */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                Description / Menu Intro
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short customer-facing blurb displayed under category header in digital menu..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* 6. Publish to Online Menu toggle */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-extrabold text-[#19244E] text-xs">Publish to Online Menu</div>
                <div className="text-[11px] text-gray-500">Make this category visible to patrons on live QR menus</div>
              </div>
              <button
                type="button"
                onClick={() => setPublishToOnlineMenu(!publishToOnlineMenu)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  publishToOnlineMenu ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    publishToOnlineMenu ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Drawer Footer Actions: Cancel, Save as Draft, Create Category */}
          <div className="p-5 border-t border-gray-200 bg-gray-50/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
