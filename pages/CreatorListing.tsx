import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '../types';
import { supabase } from '../supabaseClient';
import { useCity } from '../contexts/CityContext';

// Removed Interface CreatorListingProps as we fetch data internally

const CreatorListing: React.FC = () => {
  const { selectedCity, setSelectedCity, cities: globalCities } = useCity();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('status', 'APPROVED');

      if (error) {
        console.error('Error fetching creators:', error);
      } else {
        // Map DB fields to Frontend types if necessary (though our schema matches closely)
        const mappedCreators: Creator[] = (data || []).map(item => ({
          id: item.id,
          fullName: item.full_name,
          email: item.email,
          city: item.city,
          skills: item.skills || [],
          purchasedTags: item.purchased_tags || [],
          bio: item.bio,
          experience: item.experience,
          profilePhoto: item.profile_photo,
          portfolio: item.portfolio || [], // Ensure portfolio is JSON
          whatsapp: item.whatsapp,
          isFeatured: item.is_featured,
          tier: item.tier as any,
          status: item.status as any
        }));
        setCreators(mappedCreators);
      }
      setLoading(false);
    };

    fetchCreators();
  }, []);

  const cities = useMemo(() => Array.from(new Set(creators.map(c => c.city))), [creators]);
  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    creators.forEach(c => c.skills.forEach(s => skillsSet.add(s)));
    return Array.from(skillsSet);
  }, [creators]);

  const filteredCreators = useMemo(() => {
    return creators
      .filter(c => {
        const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.bio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === '' || c.city === selectedCity;
        const matchesSkill = selectedSkill === '' || (c.skills || []).includes(selectedSkill);
        return matchesSearch && matchesCity && matchesSkill;
      })
      .sort((a, b) => {
        if (a.tier === 'PLATINUM' && b.tier !== 'PLATINUM') return -1;
        if (a.tier !== 'PLATINUM' && b.tier === 'PLATINUM') return 1;
        if (a.tier === 'GOLD' && b.tier === 'BASE') return -1;
        if (a.tier === 'BASE' && b.tier === 'GOLD') return 1;
        return 0;
      });
  }, [creators, searchTerm, selectedCity, selectedSkill]);

  if (loading) {
    return <div className="p-24 text-center text-sm font-black uppercase tracking-widest">Loading Directory...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 pb-8 border-b-2 border-black">
        <h1 className="text-5xl font-black text-black uppercase tracking-tighter">Directory</h1>
        <p className="text-gray-500 font-mono text-sm mt-2 uppercase">CURATED PROFESSIONALS</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="SEARCH..."
          className="bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 font-bold uppercase tracking-widest text-[10px] placeholder-zinc-500 focus:border-zinc-500 outline-none w-full md:w-48"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:bg-zinc-800 transition"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">ALL CITIES</option>
          {globalCities.map(city => <option key={city} value={city}>{city.toUpperCase()}</option>)}
        </select>
        <select
          className="bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:bg-zinc-800 transition"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">ALL SKILLS</option>
          {allSkills.map(skill => <option key={skill} value={skill}>{skill.toUpperCase()}</option>)}
        </select>
      </div>

      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map(creator => {
            const isPlatinum = creator.tier === 'PLATINUM';
            const isGold = creator.tier === 'GOLD';
            const isPremium = isPlatinum || isGold;

            return (
              <Link
                key={creator.id}
                to={`/creators/${creator.id}`}
                className={`group block p-5 border-2 transition-all duration-300 relative overflow-hidden rounded-2xl hover:shadow-xl ${isPlatinum ? 'premium-platinum-border platinum-glow bg-white' :
                  isGold ? 'premium-gold-border gold-glow bg-white' :
                    'border-black bg-white hover:bg-gray-50'
                  }`}
              >
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute top-0 right-0">
                    <div className={`text-[8px] font-black px-3 py-1 uppercase tracking-widest shadow-sm rounded-bl-xl border-l border-b border-black ${isPlatinum ? 'premium-platinum-gradient text-black' : 'premium-gold-gradient text-black'
                      }`}>
                      {creator.tier}
                    </div>
                  </div>
                )}

                {/* Profile Photo */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 h-20 border-2 border-black overflow-hidden relative rounded-xl bg-gray-100">
                    <img
                      src={creator.profilePhoto}
                      alt={creator.fullName}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="flex-grow min-w-0 pt-1">
                    <h3 className={`text-base font-black uppercase tracking-tight truncate ${isPlatinum ? 'text-zinc-700' :
                      isGold ? 'text-amber-700' : 'text-black'
                      }`}>
                      {creator.fullName}
                    </h3>
                    <p className="text-xs font-mono uppercase text-gray-400 mt-0.5">{creator.city}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(creator.purchasedTags.length > 0 ? creator.purchasedTags : creator.skills).slice(0, 3).map(skill => (
                        <span key={skill} className={`text-[9px] font-bold uppercase tracking-tight px-2 py-1 rounded-lg ${isPlatinum ? 'bg-zinc-100 text-zinc-700 border border-zinc-200' :
                          isGold ? 'bg-[#bf953f] bg-opacity-10 text-[#aa771c] border border-[#bf953f] border-opacity-20' :
                            'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-500 mt-4 line-clamp-2 leading-relaxed">
                  {creator.bio || 'Creative professional ready for new opportunities.'}
                </p>

                {/* View Profile CTA */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition">View Profile</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-black rounded-xl">
          <p className="text-sm text-black font-black uppercase tracking-widest mb-4">No matching talent found</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedSkill(''); }} className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 rounded-lg">Reset Filters</button>
        </div>
      )
      }
    </div >
  );
};

export default CreatorListing;
