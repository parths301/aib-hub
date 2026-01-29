
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator, Job } from '../types';
import { supabase } from '../supabaseClient';

const Home: React.FC = () => {
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch featured creators (Platinum or is_featured)
      // Note: OR syntax in Supabase is a bit specific. 
      // For simplicity, let's just fetch approved creators and filter in JS for this MVP 
      // OR use a .or('tier.eq.PLATINUM,is_featured.eq.true')

      const { data: creatorsData } = await supabase
        .from('creators')
        .select('*')
        .eq('status', 'APPROVED');

      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false })
        .limit(4);

      if (creatorsData) {
        const mappedCreators: Creator[] = creatorsData.map(item => ({
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
        }));
        // Filter top talent
        setFeaturedCreators(
          mappedCreators
            .filter(c => c.tier === 'PLATINUM' || c.isFeatured)
            .slice(0, 6)
        );
      }

      if (jobsData) {
        const mappedJobs: Job[] = jobsData.map(item => ({
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
        }));
        setLatestJobs(mappedJobs);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-white"><div className="text-xl font-black uppercase tracking-widest animate-pulse">Loading Aib HUB...</div></div>;
  }

  return (
    <div className="bg-white">
      {/* Smaller Hero Section */}
      <section className="bg-black text-white py-12 md:py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter leading-none">
              Aib <span className="text-zinc-500">HUB</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 font-light leading-tight">
              Direct access to premium creators and verified contract opportunities. No middleman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/creators" className="bg-white text-black px-6 py-3 font-black text-xs hover:bg-gray-200 transition uppercase tracking-widest rounded-lg">Browse Talent</Link>
              <Link to="/jobs" className="border border-zinc-700 text-white px-6 py-3 font-black text-xs hover:bg-white hover:text-black transition uppercase tracking-widest rounded-lg">Find Work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Creators - Compact Profiles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Top Talent</h2>
            <p className="text-gray-500 font-mono text-[10px] mt-1 uppercase">PLATINUM & FEATURED MEMBERS</p>
          </div>
          <Link to="/creators" className="text-black font-black text-[10px] uppercase tracking-widest hover:underline">Full Directory →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCreators.map(creator => {
            const isPlatinum = creator.tier === 'PLATINUM';
            const isGold = creator.tier === 'GOLD';

            return (
              <Link
                key={creator.id}
                to={`/creators/${creator.id}`}
                className={`group block p-3 border-2 transition-all duration-300 rounded-xl hover:shadow-lg ${isPlatinum ? 'premium-platinum-border platinum-glow bg-white' :
                  isGold ? 'premium-gold-border gold-glow bg-white' :
                    'border-gray-100 bg-gray-50'
                  }`}
              >
                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-zinc-200">
                  <img
                    src={creator.profilePhoto}
                    alt={creator.fullName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  {isPlatinum && (
                    <div className="absolute top-1 right-1 premium-platinum-gradient p-1 rounded-md shadow-sm">
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className={`text-[11px] font-black uppercase truncate mb-0.5 ${isPlatinum ? 'text-zinc-700' : isGold ? 'text-amber-700' : 'text-black'
                  }`}>
                  {creator.fullName}
                </h3>
                <p className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter">{creator.city}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {creator.skills.slice(0, 1).map(skill => (
                    <span key={skill} className="text-[8px] border border-zinc-200 px-1.5 py-0.5 rounded uppercase font-bold text-zinc-500">{skill}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Paid Jobs Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">High-Value Briefs</h2>
              <p className="text-gray-500 font-mono text-[10px] mt-1 uppercase">LATEST VERIFIED OPPORTUNITIES</p>
            </div>
            <Link to="/jobs" className="text-black font-black text-[10px] uppercase tracking-widest hover:underline">Board Access →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestJobs.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="bg-white border border-gray-200 p-6 rounded-2xl group hover:border-black transition duration-300 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-black text-black uppercase tracking-tight mb-1 group-hover:underline">{job.title}</h3>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                    <span className="font-black text-zinc-600">{job.company}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{job.city}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-black font-black group-hover:text-black transition">{job.budget}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-black text-white text-[8px] font-black px-3 py-2 rounded-lg uppercase tracking-widest">View brief</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Stats & CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left bg-black text-white p-10 md:p-16 rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 premium-platinum-gradient opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="max-w-md">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-tight">Elite Networking.</h2>
            <p className="text-zinc-400 text-sm font-light mb-8">Join the community where quality portfolio speaks louder than words.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/register" className="bg-white text-black px-8 py-3 font-black text-xs hover:bg-zinc-200 transition uppercase tracking-widest rounded-xl">Join Hub</Link>
              <Link to="/membership" className="border border-zinc-700 text-white px-8 py-3 font-black text-xs hover:bg-zinc-800 transition uppercase tracking-widest rounded-xl">Pricing</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">5K+</p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Talent</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">98%</p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Success</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
