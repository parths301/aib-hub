
import React, { useState } from 'react';
import { Creator, User, MembershipTier } from '../types';

interface DashboardProps {
  user: User;
  creators: Creator[];
  setCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, creators, setCreators }) => {
  const creator = creators.find(c => c.id === user.creatorId);
  const [formData, setFormData] = useState<Creator | null>(creator || null);
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'tier'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  if (!formData) return <div className="p-10 font-mono text-xs">INITIALIZING...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setCreators(prev => prev.map(c => c.id === formData.id ? formData : c));
    setSuccessMsg('SYSTEM: PROFILE UPDATED');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleTag = (tag: string) => {
    const current = formData.purchasedTags;
    const limit = formData.tier === 'PLATINUM' ? 3 : formData.tier === 'GOLD' ? 1 : 0;
    
    if (!current.includes(tag) && current.length >= limit) {
      setSuccessMsg(`TIER LIMIT: ${formData.tier} ALLOWS ${limit} TAGS. UPGRADE TO ADD MORE.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      return;
    }

    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    
    const updated = { ...formData, purchasedTags: next };
    setFormData(updated);
    setCreators(prev => prev.map(c => c.id === formData.id ? updated : c));
  };

  const availableTags = ['Video Editor', 'Logo Creator', 'Web Developer', 'Motion Designer', 'Social Media Designer', 'UI/UX Design'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border-2 border-black overflow-hidden rounded-2xl shadow-xl">
        <div className="flex border-b-2 border-black">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
          >
            Attributes
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'portfolio' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
          >
            Archives
          </button>
          <button 
            onClick={() => setActiveTab('tier')}
            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'tier' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
          >
            Tier & Tags
          </button>
        </div>

        <div className="p-10">
          {successMsg && (
            <div className="mb-8 p-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl animate-pulse">
              {successMsg}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Legal Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Base City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">WhatsApp ID</label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Profile Asset (URL)</label>
                  <input type="text" name="profilePhoto" value={formData.profilePhoto} onChange={handleChange} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Bio Statement</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
              </div>
              <button type="submit" className="bg-black text-white px-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition rounded-xl">
                Update Profile
              </button>
            </form>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-10">
              <h3 className="text-xl font-black uppercase tracking-widest">Managed Portfolio</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {formData.portfolio.map(item => (
                  <div key={item.id} className="relative aspect-square border-2 border-black group rounded-xl overflow-hidden shadow-sm">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    <button className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-black uppercase">Remove</button>
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center hover:bg-gray-50 transition rounded-xl">
                  <span className="text-2xl mb-2">+</span>
                  <span className="text-[10px] font-black uppercase">Add Asset</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tier' && (
            <div className="space-y-20">
              {/* Membership Selection */}
              <section>
                <h3 className="text-xl font-black uppercase tracking-widest mb-10">Tier Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Gold Selection */}
                  <div className={`p-8 border-2 rounded-2xl transition cursor-pointer ${formData.tier === 'GOLD' ? 'border-[#bf953f] bg-[#bf953f] bg-opacity-5' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => {
                    const next = { ...formData, tier: 'GOLD' as MembershipTier };
                    setFormData(next);
                    setCreators(prev => prev.map(c => c.id === formData.id ? next : c));
                  }}>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2 premium-gold-text">Gold Member</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">₹799 / MO • 1 Skill Tag</p>
                    {formData.tier === 'GOLD' && <span className="bg-black text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Current Plan</span>}
                  </div>

                  {/* Platinum Selection */}
                  <div className={`p-8 border-2 rounded-2xl transition cursor-pointer shadow-lg ${formData.tier === 'PLATINUM' ? 'premium-platinum-border platinum-glow bg-zinc-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => {
                    const next = { ...formData, tier: 'PLATINUM' as MembershipTier };
                    setFormData(next);
                    setCreators(prev => prev.map(c => c.id === formData.id ? next : c));
                  }}>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2 premium-platinum-text">Platinum Member</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">₹1499 / MO • 3 Skill Tags</p>
                    {formData.tier === 'PLATINUM' && <span className="premium-platinum-gradient text-black text-[8px] font-black px-3 py-1 rounded-full uppercase border border-zinc-400">Current Plan</span>}
                  </div>
                </div>
              </section>

              {/* Tag Selection */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black uppercase tracking-widest">Skill Tags</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    Active: {formData.purchasedTags.length} / {formData.tier === 'PLATINUM' ? 3 : formData.tier === 'GOLD' ? 1 : 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`p-6 text-left border-2 rounded-xl transition flex flex-col gap-2 ${
                        formData.purchasedTags.includes(tag) 
                          ? (formData.tier === 'PLATINUM' ? 'premium-platinum-border platinum-glow bg-zinc-50' : 'border-black bg-black text-white') 
                          : 'border-gray-100 hover:border-black'
                      }`}
                    >
                      <span className={`text-xs font-black uppercase tracking-widest ${formData.purchasedTags.includes(tag) && formData.tier === 'PLATINUM' ? 'premium-platinum-text' : ''}`}>{tag}</span>
                      <span className="text-[8px] font-mono opacity-50 uppercase">Featured Tag</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
