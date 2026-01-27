
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '../types';

interface CreatorListingProps {
  creators: Creator[];
}

const CreatorListing: React.FC<CreatorListingProps> = ({ creators }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const cities = useMemo(() => Array.from(new Set(creators.map(c => c.city))), [creators]);
  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    creators.forEach(c => c.skills.forEach(s => skillsSet.add(s)));
    return Array.from(skillsSet);
  }, [creators]);

  const filteredCreators = useMemo(() => {
    return creators
      .filter(c => c.status === 'APPROVED')
      .filter(c => {
        const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.bio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === '' || c.city === selectedCity;
        const matchesSkill = selectedSkill === '' || c.skills.includes(selectedSkill);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b-2 border-black">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">Directory</h1>
          <p className="text-gray-500 font-mono text-[10px] mt-1 uppercase">CURATED PROFESSIONALS</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <input 
            type="text" 
            placeholder="SEARCH..."
            className="border-2 border-black bg-white rounded-lg px-3 py-1.5 font-bold uppercase tracking-widest text-[10px] focus:bg-gray-50 outline-none w-full md:w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="border-2 border-black bg-white rounded-lg px-3 py-1.5 outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">ALL CITIES</option>
            {cities.map(city => <option key={city} value={city}>{city.toUpperCase()}</option>)}
          </select>
          <select 
            className="border-2 border-black bg-white rounded-lg px-3 py-1.5 outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">ALL SKILLS</option>
            {allSkills.map(skill => <option key={skill} value={skill}>{skill.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCreators.map(creator => {
            const isPlatinum = creator.tier === 'PLATINUM';
            const isGold = creator.tier === 'GOLD';
            const isPremium = isPlatinum || isGold;

            return (
              <Link 
                key={creator.id} 
                to={`/creators/${creator.id}`}
                className={`group flex items-center gap-4 p-3 border-2 transition-all duration-300 relative overflow-hidden rounded-xl ${
                  isPlatinum ? 'premium-platinum-border platinum-glow bg-white' :
                  isGold ? 'premium-gold-border gold-glow bg-white' : 
                  'border-black bg-white grayscale hover:grayscale-0 hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0 w-16 h-16 border border-black overflow-hidden relative rounded-lg bg-gray-100">
                  <img 
                    src={creator.profilePhoto} 
                    alt={creator.fullName} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-xs font-black uppercase tracking-tight truncate pr-2 ${
                      isPlatinum ? 'premium-platinum-text' :
                      isGold ? 'premium-gold-text' : 'text-black'
                    }`}>
                      {creator.fullName}
                    </h3>
                    <span className="text-[7px] font-mono uppercase whitespace-nowrap text-gray-400">{creator.city}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(creator.purchasedTags.length > 0 ? creator.purchasedTags : creator.skills).slice(0, 2).map(skill => (
                      <span key={skill} className={`text-[7px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded ${
                        isPlatinum ? 'bg-zinc-100 text-zinc-600 border border-zinc-200' :
                        isGold ? 'bg-[#bf953f] bg-opacity-10 text-[#aa771c]' : 'text-gray-400 border border-gray-100'
                      }`}>
                        #{skill.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                  
                  <p className={`text-[9px] truncate mt-1 border-l pl-1.5 italic text-gray-500 border-gray-200`}>
                    {creator.bio}
                  </p>
                </div>

                {isPremium && (
                  <div className="absolute top-0 right-0">
                    <div className={`text-[6px] font-black px-2 py-0.5 uppercase tracking-widest shadow-sm rounded-bl-lg border-l border-b border-black ${
                      isPlatinum ? 'premium-platinum-gradient text-black' : 'premium-gold-gradient text-black'
                    }`}>
                      {creator.tier}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-black rounded-xl">
          <p className="text-sm text-black font-black uppercase tracking-widest mb-4">No matching talent found</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedSkill(''); }} className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 rounded-lg">Reset Filters</button>
        </div>
      )}
    </div>
  );
};

export default CreatorListing;
