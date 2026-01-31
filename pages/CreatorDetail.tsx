
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Creator } from '../types';
import { supabase } from '../supabaseClient';

const CreatorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', jobTitle: '', budget: '', message: '' });
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching creator:', error);
      } else if (data) {
        setCreator({
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
        });
      }
      setLoading(false);
    };

    fetchCreator();
  }, [id]);

  if (loading) {
    return <div className="p-24 text-center text-sm font-black uppercase tracking-widest">Loading Profile...</div>;
  }

  if (!creator) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">Profile Not Found</h2>
        <Link to="/creators" className="bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-widest rounded-lg">Return to Index</Link>
      </div>
    );
  }

  const isPlatinum = creator.tier === 'PLATINUM';
  const isGold = creator.tier === 'GOLD';
  const isPremium = isPlatinum || isGold;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;

    setInviting(true);
    const { error } = await supabase.from('invitations').insert([
      {
        creator_id: creator.id,
        sender_email: inviteForm.email,
        job_title: inviteForm.jobTitle,
        job_budget: inviteForm.budget,
        message: inviteForm.message,
        status: 'PENDING'
      }
    ]);

    if (error) {
      console.error('Invite error:', error);
      alert('Failed to send invitation. Please try again.');
    } else {
      setInvited(true);
    }
    setInviting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Link to="/creators" className="text-zinc-400 inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group hover:text-black transition">
          <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4">
          <div className={`bg-white border-2 rounded-3xl p-8 text-center sticky top-24 transition-all duration-500 ${isPlatinum ? 'premium-platinum-border platinum-glow' :
            isGold ? 'premium-gold-border gold-glow' :
              'border-black'
            }`}>
            <div className={`w-36 h-36 mx-auto mb-6 border-2 rounded-2xl overflow-hidden shadow-lg ${isPlatinum ? 'border-zinc-300' : isGold ? 'border-[#bf953f]' : 'border-black'
              }`}>
              <img src={creator.profilePhoto} alt={creator.fullName} className="w-full h-full object-cover" />
            </div>

            <h1 className={`text-3xl font-black uppercase tracking-tighter mb-1 flex items-center justify-center gap-2 ${isPlatinum ? 'premium-platinum-text' : isGold ? 'premium-gold-text' : 'text-black'
              }`}>
              {creator.fullName}
              {isPremium && (
                <svg className={`w-6 h-6 ${isPlatinum ? 'text-zinc-500' : 'text-[#bf953f]'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.604.3 1.166.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </h1>

            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-6 flex items-center justify-center gap-1.5">
              📍 {creator.city}
            </p>

            {isPlatinum && (
              <p className="text-[10px] font-black premium-platinum-gradient text-black inline-block px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-8 border border-zinc-400 shadow-sm">
                ⭐ Platinum Elite
              </p>
            )}
            {isGold && !isPlatinum && (
              <p className="text-[10px] font-black premium-gold-gradient text-black inline-block px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-8 border border-[#aa771c] shadow-sm">
                ⭐ Gold Verified
              </p>
            )}

            <div className="space-y-4">
              <a
                href={`https://wa.me/${creator.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className={`flex w-full py-4 text-[10px] font-black uppercase tracking-widest transition items-center justify-center gap-2 rounded-2xl shadow-md transform hover:-translate-y-0.5 ${isPlatinum ? 'premium-platinum-gradient text-black border border-zinc-500' :
                  isGold ? 'premium-gold-gradient text-black border border-[#aa771c]' :
                    'bg-black text-white hover:bg-zinc-800'
                  }`}
              >
                Connect on WhatsApp
              </a>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex w-full border-2 border-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition items-center justify-center gap-2 rounded-2xl transform hover:-translate-y-0.5"
              >
                Invite for Job
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Core Competencies</h3>
              <div className="flex flex-wrap justify-center gap-1.5">
                {creator.skills.map(skill => (
                  <span key={skill} className="text-[8px] font-black px-2.5 py-1.5 uppercase tracking-tighter bg-zinc-50 text-zinc-600 border border-zinc-200 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Statement Card */}
          <section className={`bg-white p-10 border-l-8 rounded-3xl shadow-sm relative overflow-hidden ${isPlatinum ? 'border-zinc-500 platinum-glow' :
            isGold ? 'border-[#bf953f] gold-glow' :
              'border-black'
            }`}>
            <div className="absolute top-4 right-6 text-6xl text-zinc-50 opacity-10 font-serif leading-none">“</div>
            <h2 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isPlatinum ? 'premium-platinum-text' : isGold ? 'premium-gold-text' : 'text-zinc-400'
              }`}>Professional Statement</h2>
            <p className="text-xl text-zinc-700 font-light leading-relaxed whitespace-pre-line italic relative z-10">
              "{creator.bio || 'This creator hasn\'t uploaded a statement yet.'}"
            </p>
          </section>

          {/* Portfolio Section */}
          <section>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">Archives & Case Studies</h2>
              <div className="flex-grow h-px bg-zinc-100"></div>
            </div>

            {creator.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {creator.portfolio.map(item => (
                  <div key={item.id} className="group relative bg-white border-2 border-black rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
                    </div>
                    <div className="p-6 bg-white border-t-2 border-black">
                      <p className="font-black uppercase text-xs tracking-widest text-black mb-1">{item.title}</p>
                      <p className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 border-2 border-dashed border-zinc-100 text-center rounded-3xl">
                <p className="text-zinc-300 font-mono text-[10px] uppercase tracking-widest">No public archives listed at this time.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-80" onClick={() => !inviting && setShowInviteModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative z-10 border-2 border-black">
            {invited ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Invitation Sent!</h2>
                <p className="text-zinc-500 text-sm">{creator.fullName} will receive your job proposal.</p>
                <button
                  onClick={() => { setShowInviteModal(false); setInvited(false); setInviteForm({ email: '', jobTitle: '', budget: '', message: '' }); }}
                  className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Invite {creator.fullName}</h2>
                <p className="text-zinc-400 text-sm mb-6">Send a job proposal directly to this creator.</p>
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Your Email</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Job Title</label>
                      <input
                        type="text"
                        value={inviteForm.jobTitle}
                        onChange={(e) => setInviteForm({ ...inviteForm, jobTitle: e.target.value })}
                        placeholder="e.g. Video Editor"
                        className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Budget</label>
                      <input
                        type="text"
                        value={inviteForm.budget}
                        onChange={(e) => setInviteForm({ ...inviteForm, budget: e.target.value })}
                        placeholder="e.g. ₹10,000"
                        className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Message</label>
                    <textarea
                      value={inviteForm.message}
                      onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                      rows={3}
                      placeholder="Describe the project..."
                      className="w-full border-2 border-black rounded-xl px-4 py-3 font-bold text-sm outline-none focus:bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 border-2 border-black py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="flex-1 bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      {inviting ? 'Sending...' : 'Send Invitation'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDetail;
