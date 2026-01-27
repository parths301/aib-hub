
import React, { useState } from 'react';
import { Creator, Job } from '../types';

interface AdminPanelProps {
  creators: Creator[];
  setCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ creators, setCreators, jobs, setJobs }) => {
  const [view, setView] = useState<'creators' | 'jobs'>('creators');

  const updateCreatorStatus = (id: string, status: Creator['status']) => {
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const toggleFeatured = (id: string) => {
    setCreators(prev => prev.map(c => c.id === id ? { ...c, isFeatured: !c.isFeatured } : c));
  };

  const removeJob = (id: string) => {
    if (confirm('Delete this job listing?')) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

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
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${
                      creator.status === 'APPROVED' ? 'bg-black text-white' :
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
                    <button onClick={() => toggleFeatured(creator.id)} className={`text-[9px] font-black uppercase tracking-widest hover:underline ${creator.isFeatured ? 'text-black italic' : 'text-gray-300'}`}>
                      {creator.isFeatured ? 'Standardize' : 'Elevate'}
                    </button>
                    <button onClick={() => setCreators(creators.filter(c => c.id !== creator.id))} className="text-[9px] text-red-600 font-black uppercase tracking-widest hover:underline">Purge</button>
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
