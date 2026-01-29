
import React, { useState, useEffect } from 'react';
import { Creator, Job } from '../types';
import { supabase } from '../supabaseClient';

const AdminPanel: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [view, setView] = useState<'creators' | 'jobs'>('creators');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Creators
    const { data: cData } = await supabase.from('creators').select('*').order('created_at', { ascending: false });
    if (cData) {
      setCreators(cData.map(item => ({
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        city: item.city,
        skills: item.skills || [],
        purchasedTags: item.purchased_tags || [],
        bio: item.bio,
        experience: item.experience,
        profilePhoto: item.profile_photo,
        portfolio: item.portfolio || [],
        whatsapp: item.whatsapp,
        isFeatured: item.is_featured,
        tier: item.tier as any,
        status: item.status as any
      })));
    }

    // Fetch Jobs
    const { data: jData } = await supabase.from('jobs').select('*').order('posted_date', { ascending: false });
    if (jData) {
      setJobs(jData.map(item => ({
        id: item.id,
        title: item.title,
        city: item.city,
        requiredSkills: item.required_skills || [],
        description: item.description,
        budget: item.budget,
        company: item.company,
        contactEmail: item.contact_email,
        whatsapp: item.whatsapp,
        postedDate: item.posted_date
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateCreatorStatus = async (id: string, status: Creator['status']) => {
    const { error } = await supabase.from('creators').update({ status }).eq('id', id);
    if (!error) {
      setCreators(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } else {
      console.error(error);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('creators').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) {
      setCreators(prev => prev.map(c => c.id === id ? { ...c, isFeatured: !currentStatus } : c));
    } else {
      console.error(error);
    }
  };

  const removeJob = async (id: string) => {
    if (confirm('Delete this job listing?')) {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (!error) {
        setJobs(prev => prev.filter(j => j.id !== id));
      } else {
        console.error(error);
      }
    }
  };

  const removeCreator = async (id: string) => {
    if (confirm('Permanently purge this creator profile?')) {
      const { error } = await supabase.from('creators').delete().eq('id', id);
      if (!error) {
        setCreators(prev => prev.filter(c => c.id !== id));
      } else {
        console.error(error);
        alert('Failed to delete creator. Check if they have linked data.');
      }
    }
  }

  if (loading) return <div className="p-24 text-center font-mono text-sm">LOADING ADMIN CONSOLE...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-16 border-b-2 border-black pb-8">
        <h1 className="text-4xl font-black text-black uppercase tracking-tighter">System Console</h1>
        <div className="flex border-2 border-black overflow-hidden font-black text-[10px] uppercase tracking-widest rounded-lg">
          <button
            onClick={() => setView('creators')}
            className={`px-8 py-3 transition ${view === 'creators' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
          >
            Creators
          </button>
          <button
            onClick={() => setView('jobs')}
            className={`px-8 py-3 transition ${view === 'jobs' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
          >
            Job Briefs
          </button>
        </div>
      </div>

      {view === 'creators' ? (
        <div className="bg-white border-2 border-black overflow-hidden rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Profile</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Locale</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Matrix Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Tier</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {creators.map(creator => (
                <tr key={creator.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={creator.profilePhoto} className="h-12 w-12 border border-black grayscale mr-4 rounded-lg" />
                      <div>
                        <p className="font-bold text-black uppercase text-sm tracking-tight">{creator.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{creator.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-mono text-gray-500 uppercase tracking-widest">{creator.city}</td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${creator.status === 'APPROVED' ? 'bg-black text-white' :
                        creator.status === 'REJECTED' ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-black border border-black'
                      }`}>
                      {creator.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    {/* Fix: Replace isPremium with tier check */}
                    {creator.tier !== 'BASE' ? <span className="premium-gold-text text-[10px] tracking-widest uppercase">{creator.tier}</span> : <span className="text-gray-300 text-[10px] tracking-widest uppercase font-mono">BASE</span>}
                  </td>
                  <td className="px-6 py-6 space-x-4">
                    {creator.status === 'PENDING' && (
                      <button onClick={() => updateCreatorStatus(creator.id, 'APPROVED')} className="text-[9px] text-black font-black uppercase tracking-widest hover:underline">Authorize</button>
                    )}
                    <button onClick={() => toggleFeatured(creator.id, creator.isFeatured)} className={`text-[9px] font-black uppercase tracking-widest hover:underline ${creator.isFeatured ? 'text-black italic' : 'text-gray-300'}`}>
                      {creator.isFeatured ? 'Standardize' : 'Elevate'}
                    </button>
                    <button onClick={() => removeCreator(creator.id)} className="text-[9px] text-red-600 font-black uppercase tracking-widest hover:underline">Purge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border-2 border-black overflow-hidden rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-black">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Brief Title</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Corporation</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-6 text-[10px] font-black text-black uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-6 text-sm font-black text-black uppercase tracking-tighter">{job.title}</td>
                  <td className="px-6 py-6 text-[11px] font-mono text-gray-400 uppercase tracking-widest">{job.company}</td>
                  <td className="px-6 py-6 text-[11px] font-mono text-gray-400 tracking-tighter">{job.postedDate}</td>
                  <td className="px-6 py-6">
                    <button onClick={() => removeJob(job.id)} className="text-[9px] text-red-600 font-black uppercase tracking-widest hover:underline">Decommission</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
