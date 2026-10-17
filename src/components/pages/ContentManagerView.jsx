import React, { useState } from 'react';

export const ContentManagerView = ({
  contentData,
  onSaveContent
}) => {
  const [formData, setFormData] = useState(contentData);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'blend' | 'team'
  const [ownerPhoto, setOwnerPhoto] = useState(
    formData?.founderPhoto || '/src/assets/owner_pic.jpg'
  );

  // Modal state for Add Barista
  const [isAddBaristaOpen, setIsAddBaristaOpen] = useState(false);
  const [newBarista, setNewBarista] = useState({
    name: '',
    role: 'Lead Barista',
    description: '',
    image: '/src/assets/beardista sign.jpg'
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'barista-1',
      name: 'Aldren "Dren" Santos',
      role: 'Lead Barista',
      description: 'Master of latte art championships and espresso extraction profiling with over 5 years craft experience.',
      image: '/src/assets/barista_ben.jpg'
    },
    {
      id: 'barista-2',
      name: 'Kimberly "Kim" Ramos',
      role: 'Full-time',
      description: 'Specializes in craft cold brew mixology and zero-proof artisanal cascara beverages.',
      image: '/src/assets/barista_dais.jpg'
    },
    {
      id: 'barista-3',
      name: 'Joshua "Josh" Dela Cruz',
      role: 'Barista',
      description: 'Single-origin manual pour-over specialist calibrated for light roast Ethiopian and Davao micro-lots.',
      image: '/src/assets/barista_ja.jpg'
    }
  ]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleOwnerPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOwnerPhoto(url);
      setFormData((prev) => ({
        ...prev,
        founderPhoto: url
      }));
    }
  };

  const handleBaristaPhotoUpload = (memberId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, image: url } : m))
      );
    }
  };

  const handleNewBaristaPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewBarista((prev) => ({ ...prev, image: url }));
    }
  };

  const handleCreateBarista = (e) => {
    e.preventDefault();
    if (!newBarista.name.trim()) return;
    const created = {
      id: `barista-${Date.now()}`,
      name: newBarista.name.trim(),
      role: newBarista.role,
      description: newBarista.description.trim() || 'Barista artisan at Beardista Brew flagship cafe.',
      image: newBarista.image || '/src/assets/beardista sign.jpg'
    };
    setTeamMembers((prev) => [...prev, created]);
    setNewBarista({
      name: '',
      role: 'Barista',
      description: '',
      image: '/src/assets/beardista sign.jpg'
    });
    setIsAddBaristaOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveContent({
      ...formData,
      founderPhoto: ownerPhoto,
      teamMembers
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* View Header - Event banner section removed completely */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
            Content Manager (CMS)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Update customer-facing story copy, blend specifications, and team bios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'story', label: 'Our Story & Founder' },
          { id: 'blend', label: 'Coffee Specs (The Beardista Blend)' },
          { id: 'team', label: 'Barista Team Roster' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#19244E] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Our Story & Founder Bio */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
          <div>
            <h2 className="text-lg font-black text-[#19244E] tracking-tight">
              Brand Narrative & Founder / Visionary
            </h2>
            <p className="text-xs text-gray-500">
              Displayed in the public About Us / Our Story sections.
            </p>
          </div>

          {/* Designated PNG Image Upload Container for Owner's Picture */}
          <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-200 border-2 border-[#19244E] flex-shrink-0 shadow-md">
                <img
                  src={ownerPhoto}
                  alt="Founder / Owner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs font-extrabold text-[#19244E] uppercase tracking-wider">
                  Owner / Visionary Portrait (PNG Image Upload)
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Upload a high-resolution PNG or JPG portrait with transparent or solid background. Recommended aspect ratio 1:1, max 5MB.
                </p>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                  <label className="px-4 py-2 bg-[#19244E] hover:bg-[#23336d] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all">
                    <span>Upload PNG Image</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleOwnerPhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setOwnerPhoto('/src/assets/owner_pic.jpg')}
                    className="px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Reset Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Official Brand Motto
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => handleChange('motto', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Owner / Founder Name
                </label>
                <input
                  type="text"
                  value={formData.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Founder Title
                </label>
                <input
                  type="text"
                  value={formData.founderTitle}
                  onChange={(e) => handleChange('founderTitle', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Pandemic Origins & Vision (Paragraph 1)
              </label>
              <textarea
                rows="4"
                value={formData.founderBio}
                onChange={(e) => handleChange('founderBio', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Community Gratitude (Paragraph 2)
              </label>
              <textarea
                rows="4"
                value={formData.communityStory}
                onChange={(e) => handleChange('communityStory', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: The Beardista Blend Coffee Specs */}
      {/* Requirement: Change the blend section fields to exactly: "Roast Profile:", "Flavor Notes:", and "Origin" */}
      {activeTab === 'blend' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
          <div>
            <h2 className="text-lg font-black text-[#19244E] tracking-tight">
              Coffee Specs: The Beardista Blend
            </h2>
            <p className="text-xs text-gray-500">
              Displayed in the public "The Beardista Blend" specifications card.
            </p>
          </div>

          <div className="space-y-4">
            {/* Field 1: Roast Profile: */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Roast Profile:
              </label>
              <input
                type="text"
                value={formData.blendRoastLevel || 'Medium-Dark Artisanal Roast (Slow-Drum Roasted)'}
                onChange={(e) => handleChange('blendRoastLevel', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                placeholder="e.g. Medium-Dark Artisanal Roast (Slow-Drum Roasted)"
              />
            </div>

            {/* Field 2: Flavor Notes: */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Flavor Notes:
              </label>
              <textarea
                rows="3"
                value={formData.blendNotes || 'Dark cacao, toasted hazelnut, muscovado molasses, and lingering cedar spice finish.'}
                onChange={(e) => handleChange('blendNotes', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                placeholder="e.g. Dark cacao, toasted hazelnut, muscovado molasses"
              />
            </div>

            {/* Field 3: Origin Info: */}
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Origin Info:
              </label>
              <input
                type="text"
                value={formData.blendOrigins || '70% Mt. Apo Arabica (Mindanao) + 30% Benguet Bourbon (Cordillera)'}
                onChange={(e) => handleChange('blendOrigins', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                placeholder="e.g. Mt. Apo Arabica & Benguet Bourbon"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dynamic Barista Team Roster */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#19244E] tracking-tight">
                Meet The Team (Barista Team Roster)
              </h2>
              <p className="text-xs text-gray-500">
                Manage barista profiles, portraits, roles, and craft descriptions displayed on public story pages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddBaristaOpen(true)}
              className="px-4 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="text-base leading-none font-black">+</span>
              <span>Add Barista</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={member.id}
                className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4 relative group flex flex-col justify-between"
              >
                {/* Header Badge & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#19244E] text-[#FFF3E7] font-black text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100/70 text-amber-900 font-extrabold text-[10px] rounded-md">
                      {member.role || 'Barista'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTeamMembers(teamMembers.filter((m) => m.id !== member.id))}
                    className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                    title="Remove from roster"
                  >
                    ✕
                  </button>
                </div>

                {/* Dedicated PNG/JPG Image Upload Container */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2.5">
                  <span className="block text-[10px] font-black text-[#19244E] uppercase tracking-wider">
                    Barista Profile Photo (PNG / JPG)
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0 shadow-xs">
                      <img
                        src={
                          member.image ||
                          '/src/assets/beardista sign.jpg'
                        }
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            '/src/assets/beardista sign.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-block px-3 py-1.5 bg-[#19244E] hover:bg-[#273875] text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all active:scale-95 shadow-xs">
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => handleBaristaPhotoUpload(member.id, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = teamMembers.map((m) =>
                            m.id === member.id
                              ? {
                                  ...m,
                                  image:
                                    '/src/assets/beardista sign.jpg'
                                }
                              : m
                          );
                          setTeamMembers(updated);
                        }}
                        className="block text-[10px] font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                      >
                        Reset to default
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const updated = teamMembers.map((m) =>
                        m.id === member.id ? { ...m, name: e.target.value } : m
                      );
                      setTeamMembers(updated);
                    }}
                    placeholder="Barista full name or handle"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422]"
                  />
                </div>

                {/* Role Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) => {
                      const updated = teamMembers.map((m) =>
                        m.id === member.id ? { ...m, role: e.target.value } : m
                      );
                      setTeamMembers(updated);
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] cursor-pointer"
                  >
                    <option value="Lead Barista">Lead Barista</option>
                    <option value="Barista">Barista</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Senior Barista">Senior Barista</option>
                    <option value="Head Roaster">Head Roaster</option>
                  </select>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={member.description || member.specialty || ''}
                    onChange={(e) => {
                      const updated = teamMembers.map((m) =>
                        m.id === member.id ? { ...m, description: e.target.value } : m
                      );
                      setTeamMembers(updated);
                    }}
                    placeholder="Craft specialties, experience notes, latte art accolades..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-700 outline-none focus:ring-2 focus:ring-[#E58422]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pop-up Modal: Add Barista */}
      {isAddBaristaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsAddBaristaOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden z-10 animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#19244E] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#E58422] flex items-center justify-center text-white font-bold text-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Add Barista Team Member</h3>
                  <p className="text-[11px] text-[#FFF3E7]/70">Add a craftsman to the Beardista team roster</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBaristaOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateBarista} className="p-6 space-y-4">
              {/* Dedicated Image Upload PNG Container */}
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 space-y-2">
                <span className="block text-xs font-bold text-[#19244E] uppercase tracking-wider">
                  Barista Picture (PNG / JPG)
                </span>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 border-2 border-[#19244E] flex-shrink-0 shadow-xs">
                    <img
                      src={newBarista.image}
                      alt="Barista Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="inline-block px-3.5 py-1.5 bg-[#19244E] hover:bg-[#253570] text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs">
                      <span>Upload PNG / JPG</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleNewBaristaPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Recommended 1:1 aspect ratio, high-resolution portrait.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBarista.name}
                  onChange={(e) => setNewBarista({ ...newBarista, name: e.target.value })}
                  placeholder="e.g. Maria 'Ria' Santos"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422]"
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Role Dropdown *
                </label>
                <select
                  value={newBarista.role}
                  onChange={(e) => setNewBarista({ ...newBarista, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] cursor-pointer"
                >
                  <option value="Lead Barista">Lead Barista</option>
                  <option value="Barista">Barista</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Senior Barista">Senior Barista</option>
                </select>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={newBarista.description}
                  onChange={(e) => setNewBarista({ ...newBarista, description: e.target.value })}
                  placeholder="Barista craft background, calibration experience, and favorite signature brews..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-700 outline-none focus:ring-2 focus:ring-[#E58422]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBaristaOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Add to Team Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};