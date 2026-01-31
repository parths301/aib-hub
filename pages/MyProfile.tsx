
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Creator, User, PortfolioItem } from '../types';
import { supabase } from '../supabaseClient';

interface MyProfileProps {
  user: User;
  // Removed creators and setCreators props as we fetch internally
}

const MyProfile: React.FC<MyProfileProps> = ({ user }) => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  // States for inline editing
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  // Local form states
  const [tempBio, setTempBio] = useState('');
  const [tempInfo, setTempInfo] = useState({
    fullName: '',
    city: '',
    whatsapp: '',
    profilePhoto: ''
  });
  const [newAsset, setNewAsset] = useState({ title: '', url: '', type: 'image' as const });

  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);
      // Assuming user.creatorId is linked, but even better, we can query by linked_user_id if we set that up.
      // For now, let's rely on the user.creatorId if available, OR query where linked_user_id = user.id

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
        setCreator(mappedCreator);
        setTempBio(mappedCreator.bio);
        setTempInfo({
          fullName: mappedCreator.fullName,
          city: mappedCreator.city,
          whatsapp: mappedCreator.whatsapp,
          profilePhoto: mappedCreator.profilePhoto
        });
      }
      setLoading(false);
    };

    if (user) fetchMyProfile();
  }, [user]);


  const updateCreatorInDB = async (updatedData: Partial<Creator>) => {
    if (!creator) return;

    // Map partial Creator back to DB columns
    const dbUpdate: any = {};
    if (updatedData.bio !== undefined) dbUpdate.bio = updatedData.bio;
    if (updatedData.fullName !== undefined) dbUpdate.full_name = updatedData.fullName;
    if (updatedData.city !== undefined) dbUpdate.city = updatedData.city;
    if (updatedData.whatsapp !== undefined) dbUpdate.whatsapp = updatedData.whatsapp;
    if (updatedData.profilePhoto !== undefined) dbUpdate.profile_photo = updatedData.profilePhoto;
    if (updatedData.portfolio !== undefined) dbUpdate.portfolio = updatedData.portfolio;

    const { error } = await supabase
      .from('creators')
      .update(dbUpdate)
      .eq('id', creator.id);

    if (error) {
      alert('Error updating profile');
      console.error(error);
    } else {
      setCreator(prev => prev ? ({ ...prev, ...updatedData }) : null);
    }
  };

  const handleSaveBio = async () => {
    await updateCreatorInDB({ bio: tempBio });
    setIsEditingBio(false);
  };

  const handleSaveInfo = async () => {
    await updateCreatorInDB(tempInfo);
    setIsEditingInfo(false);
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;
    const asset: PortfolioItem = {
      id: 'p' + Date.now(),
      ...newAsset
    };
    const newPortfolio = [...creator.portfolio, asset];
    await updateCreatorInDB({ portfolio: newPortfolio });
    setNewAsset({ title: '', url: '', type: 'image' });
    setIsAddingAsset(false);
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!creator) return;
    if (confirm('Permanently remove this asset from your archive?')) {
      const newPortfolio = creator.portfolio.filter(p => p.id !== assetId);
      await updateCreatorInDB({ portfolio: newPortfolio });
    }
  };

  if (loading) return <div className="p-10 text-center font-mono">LOADING PROFILE...</div>;

  if (!creator) {
    return <div className="p-10 text-center">Profile not found. Please contact support.</div>;
  }

  const isPlatinum = creator.tier === 'PLATINUM';
  const isGold = creator.tier === 'GOLD';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Self-View Header Notice */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between bg-zinc-900 p-6 rounded-2xl border border-black shadow-2xl">
        <div className="mb-4 md:mb-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
            CREATOR HUB CONTROL PANEL
          </p>
          <h2 className="text-white text-lg font-black uppercase tracking-tighter">Your Public Identity</h2>
        </div>
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition shadow-lg"
          >
            System Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4">
          <div className={`bg-white border-2 rounded-3xl p-8 text-center sticky top-24 transition-all duration-500 shadow-sm ${isPlatinum ? 'premium-platinum-border platinum-glow' :
            isGold ? 'premium-gold-border gold-glow' :
              'border-black'
            }`}>

            {/* Edit Info Toggle */}
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="absolute top-6 right-6 text-zinc-300 hover:text-black transition"
              title="Edit Basic Info"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>

            {isEditingInfo ? (
              <div className="space-y-4 text-left">
                <div className="w-24 h-24 mx-auto mb-4 border-2 border-black rounded-2xl overflow-hidden">
                  <img src={tempInfo.profilePhoto} className="w-full h-full object-cover opacity-50" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-400">Photo URL</label>
                  <input type="text" value={tempInfo.profilePhoto} onChange={e => setTempInfo({ ...tempInfo, profilePhoto: e.target.value })} className="w-full border border-zinc-200 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-400">Full Name</label>
                  <input type="text" value={tempInfo.fullName} onChange={e => setTempInfo({ ...tempInfo, fullName: e.target.value })} className="w-full border border-zinc-200 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-400">City</label>
                  <input type="text" value={tempInfo.city} onChange={e => setTempInfo({ ...tempInfo, city: e.target.value })} className="w-full border border-zinc-200 rounded-lg p-2 text-xs" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSaveInfo} className="flex-1 bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Save</button>
                  <button onClick={() => { setIsEditingInfo(false); setTempInfo({ fullName: creator.fullName, city: creator.city, whatsapp: creator.whatsapp, profilePhoto: creator.profilePhoto }); }} className="flex-1 border border-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-32 h-32 mx-auto mb-6 border-2 rounded-2xl overflow-hidden shadow-inner ${isPlatinum ? 'border-zinc-300' : isGold ? 'border-[#bf953f]' : 'border-black'
                  }`}>
                  <img src={creator.profilePhoto} alt={creator.fullName} className="w-full h-full object-cover" />
                </div>

                <h1 className={`text-3xl font-black uppercase tracking-tighter mb-1 ${isPlatinum ? 'premium-platinum-text' : isGold ? 'premium-gold-text' : 'text-black'
                  }`}>
                  {creator.fullName}
                </h1>

                <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-4">
                  📍 {creator.city}
                </p>

                {isPlatinum ? (
                  <span className="premium-platinum-gradient text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-zinc-400 inline-block mb-6 shadow-sm">
                    Steel Platinum
                  </span>
                ) : isGold ? (
                  <span className="premium-gold-gradient text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#aa771c] inline-block mb-6 shadow-sm">
                    Gold Member
                  </span>
                ) : (
                  <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-zinc-200 inline-block mb-6">
                    Free Tier
                  </span>
                )}

                <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                  {creator.skills.map(skill => (
                    <span key={skill} className="bg-zinc-50 text-zinc-500 border border-zinc-200 text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-6 border-t border-zinc-100 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-400">Public WhatsApp</span>
                    <span className="text-black font-black">{creator.whatsapp || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-400">Matrix Status</span>
                    <span className="text-green-600 font-black">ACTIVE</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* About Section */}
          <section className="bg-white border-2 border-black p-10 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Professional Statement</h2>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-zinc-300 hover:text-black transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-4">
                <textarea
                  value={tempBio}
                  onChange={e => setTempBio(e.target.value)}
                  className="w-full border-2 border-zinc-100 rounded-2xl p-6 text-lg font-light italic text-zinc-800 focus:border-black outline-none min-h-[200px]"
                  placeholder="Describe your artistic mission..."
                />
                <div className="flex gap-4">
                  <button onClick={handleSaveBio} className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Statement</button>
                  <button onClick={() => { setIsEditingBio(false); setTempBio(creator.bio); }} className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Discard Changes</button>
                </div>
              </div>
            ) : (
              <p className="text-xl text-zinc-800 font-light leading-relaxed italic">
                "{creator.bio || 'Enter a professional statement to attract clients.'}"
              </p>
            )}
          </section>

          {/* Portfolio Grid */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Archives & Public Portfolio</h2>
              <button
                onClick={() => setIsAddingAsset(!isAddingAsset)}
                className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition"
              >
                {isAddingAsset ? 'Cancel Upload' : 'Add New Asset +'}
              </button>
            </div>

            {isAddingAsset && (
              <form onSubmit={handleAddAsset} className="mb-12 bg-zinc-50 border-2 border-dashed border-zinc-200 p-8 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-zinc-400 mb-2 block">Asset Title</label>
                    <input type="text" value={newAsset.title} onChange={e => setNewAsset({ ...newAsset, title: e.target.value })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" placeholder="e.g. Brand Identity 2024" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-zinc-400 mb-2 block">Type</label>
                    <select value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value as any })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="sample">Project Link</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-400 mb-2 block">Image URL / Direct Link</label>
                  <input type="text" value={newAsset.url} onChange={e => setNewAsset({ ...newAsset, url: e.target.value })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" placeholder="https://..." required />
                </div>
                <button type="submit" className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl">Commit to Archive</button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {creator.portfolio.map(item => (
                <div key={item.id} className="group relative bg-white border-2 border-black rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                    <button
                      onClick={() => handleDeleteAsset(item.id)}
                      className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="p-6 border-t-2 border-black bg-white">
                    <p className="text-xs font-black uppercase tracking-widest text-black mb-1">{item.title}</p>
                    <p className="text-[8px] font-mono uppercase text-zinc-400">{item.type}</p>
                  </div>
                </div>
              ))}

              {creator.portfolio.length === 0 && !isAddingAsset && (
                <div className="col-span-full py-32 border-2 border-dashed border-zinc-100 rounded-3xl text-center">
                  <p className="text-zinc-300 font-mono text-[10px] uppercase tracking-widest">Archive is currently empty.</p>
                  <button onClick={() => setIsAddingAsset(true)} className="mt-4 text-black text-[10px] font-black uppercase tracking-widest underline decoration-zinc-200 hover:decoration-black transition">Upload Portfolio Items →</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
