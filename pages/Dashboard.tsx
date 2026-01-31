
import React, { useState, useEffect } from 'react';
import { Creator, User, MembershipTier } from '../types';
import { supabase } from '../supabaseClient';

interface DashboardProps {
  user: User;
  // Removed creators and setCreators
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [formData, setFormData] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'tier'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);
      // Query creator by linked_user_id which is the auth user's ID
      const query = supabase
        .from('creators')
        .select('*')
        .eq('linked_user_id', user.id);

      const { data, error } = await query.single();

      if (data) {
        const mappedCreator: Creator = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          city: data.city,
          skills: data.skills || [],
          purchasedTags: data.purchased_tags || [],
          bio: data.bio,
          experience: data.experience,
          profilePhoto: data.profile_photo,
          portfolio: data.portfolio || [],
          whatsapp: data.whatsapp,
          isFeatured: data.is_featured,
          tier: data.tier as any,
          status: data.status as any
        };
        setFormData(mappedCreator);
      }
      setLoading(false);
    };

    if (user) fetchMyProfile();
  }, [user]);

  if (loading) return <div className="p-10 font-mono text-xs">INITIALIZING SYSTEM...</div>;

  if (!formData) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white border-2 border-black p-10 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Setup Settings</h2>
          <p className="text-gray-500 mb-8 text-sm">Initialize your creator settings to continue.</p>
          <button
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.from('creators').insert([{
                linked_user_id: user.id,
                full_name: user.user_metadata?.full_name || 'Anonymous',
                email: user.email,
                city: user.user_metadata?.city || '',
                skills: [],
                purchased_tags: [],
                bio: '',
                status: 'PENDING',
                tier: 'BASE',
                is_featured: false,
                profile_photo: `https://picsum.photos/seed/${user.id}/400/400`
              }]);

              if (error) {
                console.error('Error creating profile:', error);
                alert('Failed to create profile. Please contact support.');
              } else {
                window.location.reload();
              }
              setLoading(false);
            }}
            className="bg-black text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition"
          >
            Initialize Settings
          </button>
        </div>
      </div>
    );
  }

  const updateCreatorInDB = async (updatedData: Partial<Creator>) => {
    // Map partial Creator back to DB columns
    const dbUpdate: any = {};
    if (updatedData.bio !== undefined) dbUpdate.bio = updatedData.bio;
    if (updatedData.fullName !== undefined) dbUpdate.full_name = updatedData.fullName;
    if (updatedData.city !== undefined) dbUpdate.city = updatedData.city;
    if (updatedData.whatsapp !== undefined) dbUpdate.whatsapp = updatedData.whatsapp;
    if (updatedData.profilePhoto !== undefined) dbUpdate.profile_photo = updatedData.profilePhoto;
    if (updatedData.portfolio !== undefined) dbUpdate.portfolio = updatedData.portfolio;
    if (updatedData.tier !== undefined) dbUpdate.tier = updatedData.tier;
    if (updatedData.purchasedTags !== undefined) dbUpdate.purchased_tags = updatedData.purchasedTags;
    if (updatedData.skills !== undefined) dbUpdate.skills = updatedData.skills;
    if (updatedData.experience !== undefined) dbUpdate.experience = updatedData.experience;

    const { error } = await supabase
      .from('creators')
      .update(dbUpdate)
      .eq('id', formData.id);

    if (error) {
      console.error(error);
      setSuccessMsg('ERROR UPDATING SYSTEM');
    } else {
      setFormData(prev => prev ? ({ ...prev, ...updatedData }) : null);
      setSuccessMsg('SYSTEM: PROFILE UPDATED');
    }
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    // Note: We are not auto-saving on every keystroke here, but the original code didn't either (it updated local state).
    // The original code had a handleSave.
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    updateCreatorInDB({
      fullName: formData.fullName,
      city: formData.city,
      whatsapp: formData.whatsapp,
      profilePhoto: formData.profilePhoto,
      bio: formData.bio,
      skills: formData.skills,
      experience: formData.experience
    });
  };

  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => prev ? ({ ...prev, skills: [...prev.skills, newSkill.trim()] }) : null);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => prev ? ({ ...prev, skills: prev.skills.filter(s => s !== skill) }) : null);
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

    updateCreatorInDB({ purchasedTags: next });
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
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Years of Experience</label>
                <input type="text" name="experience" value={formData.experience || ''} onChange={handleChange} placeholder="e.g. 5+ years in video editing" className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50" />
              </div>

              {/* Skills Editor */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Your Skills</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map(skill => (
                    <span key={skill} className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-zinc-400 hover:text-white">&times;</button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && <span className="text-zinc-400 text-xs italic">No skills added yet</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="flex-1 border-2 border-zinc-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-black"
                  />
                  <button type="button" onClick={addSkill} className="bg-zinc-100 hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition">
                    Add
                  </button>
                </div>
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
                    updateCreatorInDB({ tier: 'GOLD' });
                  }}>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2 premium-gold-text">Gold Member</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">₹799 / MO • 1 Skill Tag</p>
                    {formData.tier === 'GOLD' && <span className="bg-black text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Current Plan</span>}
                  </div>

                  {/* Platinum Selection */}
                  <div className={`p-8 border-2 rounded-2xl transition cursor-pointer shadow-lg ${formData.tier === 'PLATINUM' ? 'premium-platinum-border platinum-glow bg-zinc-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => {
                    updateCreatorInDB({ tier: 'PLATINUM' });
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
                      className={`p-6 text-left border-2 rounded-xl transition flex flex-col gap-2 ${formData.purchasedTags.includes(tag)
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
