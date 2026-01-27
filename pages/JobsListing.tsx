
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';

interface JobsListingProps {
  jobs: Job[];
}

const JobsListing: React.FC<JobsListingProps= ({ jobs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 pb-8 border-b-2 border-black">
        <h1 className="text-5xl font-black text-black uppercase tracking-tighter">Opportunities</h1>
        <p className="text-gray-500 font-mono text-sm mt-2 uppercase">VERIFIED CONTRACTS & ROLES</p>
      </div>

      <div className="space-y-8">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-white border-2 border-black p-8 group hover:bg-black transition duration-300 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-black text-black group-hover:text-white uppercase tracking-tight transition">{job.title}</h3>
                    <span className="bg-black text-white group-hover:bg-white group-hover:text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest transition rounded-md">OPEN</span>
                    <span className="ml-auto md:ml-0 text-xl font-black text-black group-hover:text-white transition">{job.budget}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono text-gray-500 group-hover:text-gray-400 uppercase tracking-widest mb-6 transition">
                    <span className="flex items-center gap-1.5 font-black text-black group-hover:text-white">
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {job.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 border border-black group-hover:border-white text-black group-hover:text-white transition rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link 
                    to={`/jobs/${job.id}`}
                    className="inline-block bg-black text-white group-hover:bg-white group-hover:text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition rounded-xl"
                  >
                    View Brief
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest italic">No active requisitions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsListing;
